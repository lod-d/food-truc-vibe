# Stage 1: PHP dependencies
FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Stage 2: Build frontend (PHP + Node — requis par le plugin wayfinder qui appelle php artisan)
FROM php:8.3-cli-alpine AS builder

RUN apk add --no-cache nodejs npm

WORKDIR /app

# PHP vendor from stage 1
COPY --from=vendor /app/vendor vendor/

# Application source
COPY . .

# npm build (wayfinder peut maintenant appeler php artisan)
RUN npm ci && npm run build

# Stage 3: PHP runtime
FROM php:8.3-fpm-alpine AS app

# Install system dependencies + PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    mysql-client \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        gd \
        zip \
        opcache \
        intl

WORKDIR /var/www/html

# Copy vendor + built app from previous stages
COPY --from=vendor /app/vendor vendor/
COPY --from=builder /app/public/build public/build
COPY . .

# Docker config
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p storage/logs storage/framework/{cache,sessions,views} \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
