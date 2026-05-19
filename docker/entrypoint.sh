#!/bin/sh
set -e

cd /var/www/html

# Storage permissions
mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Wait for MySQL with PHP PDO
echo "Waiting for database..."
until php -r "new PDO('mysql:host=${DB_HOST};port=${DB_PORT:-3306};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; do
    sleep 2
done
echo "Database ready."

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan db:seed --class=CuisineSeeder --force
php artisan storage:link --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
