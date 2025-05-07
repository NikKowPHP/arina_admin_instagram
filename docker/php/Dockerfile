FROM php:8.2-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_pgsql zip bcmath opcache

RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/local/bin --filename=composer

RUN groupadd -g 1000 appuser \
    && useradd -u 1000 -ms /bin/bash -g appuser appuser \
    && chown -R appuser:appuser /var/www/html
USER appuser

RUN git config --global --add safe.directory /var/www/html

RUN mkdir -p storage/framework/{views,cache/data,sessions} storage/logs

COPY --chown=appuser:appuser . .

RUN composer install \
    --no-interaction \
    --prefer-dist \
    --no-dev \
    --optimize-autoloader

# Switch back to root to set permissions & install entrypoint
USER root

# copy and make your entrypoint executable
RUN chown -R appuser:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

USER appuser

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
