#!/bin/sh
set -e

# Start the Laravel queue worker in the background.
# The --tries=3 and --sleep=5 are examples; adjust as needed for your application.
echo "Starting queue worker..."
php /var/www/html/artisan queue:work --verbose --tries=3 --sleep=5 &

# Execute the CMD from the Dockerfile (e.g., php-fpm)
exec "$@"
