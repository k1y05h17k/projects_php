# ===== 1) Stage de deps do sistema e Composer =====
FROM composer:2.7 AS vendor

# Copia apenas os manifests para cache eficiente
WORKDIR /app
COPY backend/composer.json backend/composer.lock* ./ 
# Instala dependências (sem dev por padrão)
RUN composer install --no-dev --no-interaction --no-scripts --prefer-dist --no-progress --no-ansi

# ===== 2) Stage app com PHP-FPM =====
FROM php:8.2-fpm-alpine AS app

# Variáveis
ENV APP_ENV=production \
    PHP_MEMORY_LIMIT=256M \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=1 \
    PHP_OPCACHE_MAX_ACCELERATED_FILES=20000 \
    PHP_OPCACHE_MEMORY_CONSUMPTION=128

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Pacotes necessários (sqlite, gd opcional, etc.)
RUN set -eux; \
    apk add --no-cache icu-dev oniguruma-dev libzip-dev zlib-dev sqlite-dev bash shadow tzdata; \
    docker-php-ext-configure intl; \
    docker-php-ext-install intl mbstring zip pdo pdo_sqlite; \
    # Opcache
    docker-php-ext-install opcache; \
    # Limpa
    rm -rf /var/cache/apk/*

# Usuário não-root (UID 1000 para bater com host comum)
RUN useradd -u 1000 -ms /bin/bash laravel

# Diretório do app
WORKDIR /var/www/html

# Copia o código do app
# (Use --chown para garantir permissões ao usuário "laravel")
COPY --chown=laravel:laravel backend/ /var/www/html/

# Copia vendor do stage composer (apenas se já existir composer.json)
COPY --from=vendor /app/vendor/ /var/www/html/vendor/

# Configurações PHP extras (opcache, etc.)
RUN { \
  echo "opcache.enable=1"; \
  echo "opcache.enable_cli=1"; \
  echo "opcache.validate_timestamps=${PHP_OPCACHE_VALIDATE_TIMESTAMPS}"; \
  echo "opcache.max_accelerated_files=${PHP_OPCACHE_MAX_ACCELERATED_FILES}"; \
  echo "opcache.memory_consumption=${PHP_OPCACHE_MEMORY_CONSUMPTION}"; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Permissões de storage/bootstrap e criação do DB sqlite (em runtime também faremos)
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs storage/database bootstrap/cache && \
    chown -R laravel:laravel storage bootstrap/cache

USER laravel

# Comando padrão (php-fpm)
CMD ["php-fpm", "-F"]
