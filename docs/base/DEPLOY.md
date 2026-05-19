# Déploiement — Docker / Dokploy

TruckMap se déploie via un Dockerfile multi-stage sur Dokploy (PaaS self-hosted basé sur Docker + Traefik). La base de données MySQL est un service séparé dans Dokploy.

## Architecture de l'image

```
Stage 1 — node:22-alpine (frontend)
  └── npm ci + npm run build → /app/public/build

Stage 2 — php:8.4-fpm-alpine (runtime)
  ├── Extensions PHP : pdo_mysql, gd, mbstring, zip, opcache, intl
  ├── Nginx (port 80)
  ├── Supervisord → php-fpm + nginx + queue:work
  └── Entrypoint : health check DB → migrate → supervisord
```

Un seul conteneur expose le port 80. Traefik (Dokploy) gère le TLS et le reverse proxy.

## Configuration Dokploy

### 1. Créer le service

Dans Dokploy : **New Application** → **Dockerfile** (pas docker-compose).

- Source : dépôt Git
- Branch : `main`
- Build type : `Dockerfile`

### 2. Base de données

Créer un service **MySQL 8** dans Dokploy. Récupérer l'host interne (ex: `mysql-truckmap`).

### 3. Variables d'environnement

Copier `.env.docker.example`, remplir toutes les valeurs et les coller dans **Settings > Environment** de Dokploy :

```env
APP_NAME=TruckMap
APP_ENV=production
APP_KEY=                    # php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://votre-domaine.com   # DOIT être https://

APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr

BCRYPT_ROUNDS=14

LOG_CHANNEL=stderr
LOG_LEVEL=error

# Base de données (nom du service Dokploy)
DB_CONNECTION=mysql
DB_HOST=nom-du-service-mysql
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=mot_de_passe_fort

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_DOMAIN=.votre-domaine.com

# Queue & Cache
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=public

# Email Gmail (App Password)
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=votre.adresse@gmail.com
MAIL_PASSWORD=app_password_16_chars
MAIL_FROM_ADDRESS=votre.adresse@gmail.com
MAIL_FROM_NAME=TruckMap

VITE_APP_NAME=TruckMap
```

> `APP_URL` doit impérativement être en `https://`. C'est ce que Laravel utilise pour générer les liens de vérification email signés — si `http://` est utilisé, les liens donnent une erreur 403.

### 4. Domaine

Dans Dokploy, ajouter le domaine dans **Domains**. Traefik gère automatiquement le certificat Let's Encrypt.

### 5. Premier déploiement

Lancer le build depuis Dokploy. Au démarrage, l'entrypoint :

1. Attend que MySQL soit disponible (health check PDO)
2. Cache la configuration, les routes et les vues
3. Lance `php artisan migrate --force`
4. Crée le lien symbolique `storage/public`
5. Lance Supervisord (nginx + php-fpm + queue worker)

Les logs de démarrage sont visibles dans **Logs** de Dokploy.

## Construire l'image localement

```bash
docker build -t truckmap .

docker run -p 8080:80 \
  --env-file .env \
  truckmap
```

L'application est alors disponible sur `http://localhost:8080`.

## Après un redéploiement

Les migrations sont relancées automatiquement à chaque démarrage (`migrate --force`). Les seeders ne sont **pas** relancés en production — ils sont réservés à l'environnement local (`APP_ENV=local`).

Pour seeder manuellement en prod (ex: premiers types de cuisine) :

```bash
# Via Dokploy → Console ou exec dans le conteneur
php artisan db:seed --class=CuisineSeeder
```

## Configurer Gmail pour les emails

1. Activer la validation en deux étapes sur le compte Google
2. Aller sur [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Créer un App Password pour "Mail"
4. Copier les 16 caractères (sans espaces) dans `MAIL_PASSWORD`
5. Utiliser le port 465 avec `MAIL_SCHEME=smtps` (pas `ssl`, pas `tls`)
