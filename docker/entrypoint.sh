#!/bin/sh
set -e

cd /var/www/html

# Storage permissions
mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Wait for MySQL with mysqladmin ping
echo "Waiting for database..."
until mysqladmin ping -h"${DB_HOST:-mysql}" -u"${DB_USERNAME:-root}" -p"${DB_PASSWORD}" --silent 2>/dev/null; do
    sleep 2
done
echo "Database ready."

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
