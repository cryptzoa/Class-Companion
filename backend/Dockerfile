FROM php:8.3-cli

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
    unzip

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

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Change current user to www (optional for CLI but good practice if we switched to FPM later)
# For simple CLI serve, running as root within container is often default and fine for this context, 
# but let's keep permission fix for storage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port (Documentation only, Railway overrides this)
EXPOSE 8080

# Start Laravel Server with automatic migration
CMD php artisan migrate --force && \
    php artisan filament:upgrade && \
    php artisan storage:link && \
    php artisan optimize && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
