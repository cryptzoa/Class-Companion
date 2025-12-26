FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    nginx \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Copy Config Files
COPY backend/nginx.conf /etc/nginx/nginx.conf
COPY backend/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Change permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8080 (Matches nginx.conf)
EXPOSE 8080

# Start Supervisor (which starts Nginx and PHP-FPM)
CMD php artisan migrate --force && \
    php artisan filament:upgrade && \
    php artisan storage:link && \
    php artisan optimize && \
    /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
