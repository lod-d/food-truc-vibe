#!/bin/sh
set -e

cd /var/www/html

# Ensure storage directories exist with correct permissions
mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Wait for MySQL to be ready
echo "Waiting for database..."
until php artisan db:monitor --max=1 2>/dev/null; do
    sleep 2
done
echo "Database ready."

# Run Laravel setup
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
