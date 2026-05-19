# TruckMap

Trouvez les food trucks ouverts près de chez vous. Carte interactive, filtres par cuisine et horaires, géolocalisation, espace propriétaire pour enregistrer et gérer son truck.

## Stack

| Couche | Technologie |
|---|---|
| Backend | Laravel 13, PHP 8.4, MySQL 8 |
| Frontend | Vue 3, TypeScript, Inertia.js v2 |
| CSS | Tailwind CSS v4 (CSS-first, pas de tailwind.config.js) |
| Carte | Leaflet.js + leaflet.markercluster, tuiles CartoDB Positron |
| Géocodage | Nominatim (OpenStreetMap), limité à la France |
| Emails | SMTP (Gmail + App Password recommandé en prod) |

## Lancer en développement

### Prérequis

- PHP 8.4 + Composer
- Node.js 22
- MySQL 8 — base `truckmap`, user `root`, pas de mot de passe

### Installation

```bash
git clone <repo>
cd food-trucs-maps

# Dépendances
composer install
npm install

# Environnement
cp .env.example .env
php artisan key:generate
```

Vérifier que `.env` contient :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=log   # Les emails s'affichent dans les logs, aucun SMTP requis
```

```bash
# Base de données
php artisan migrate
php artisan db:seed   # 10 types de cuisine + compte dev pré-vérifié
```

### Démarrer

```bash
composer run dev
```

Lance en parallèle : serveur PHP (`localhost:8000`), Vite HMR, queue worker et tail des logs.

**Compte de test** : `dev@truckmap.fr` / `password`
Pré-vérifié, accès complet à l'espace admin et au formulaire d'enregistrement.

> En local (`APP_ENV=local`), tout compte créé via `/inscription` est automatiquement vérifié — pas besoin de SMTP pour tester le flux complet.

## Déploiement (Docker / Dokploy)

Voir [docs/base/DEPLOY.md](docs/base/DEPLOY.md) pour les instructions complètes.

L'image Docker est multi-stage : build Node → runtime PHP 8.4-fpm + Nginx + Supervisord dans un seul conteneur.

```bash
docker build -t truckmap .
docker run -p 80:80 --env-file .env truckmap
```

## Commandes utiles

```bash
# Dev
composer run dev          # Tout en parallèle (recommandé)
npm run dev               # Vite seul
npm run build             # Build frontend production
npm run lint              # ESLint
npm run format            # Prettier
npm run types:check       # TypeScript

# Artisan
php artisan migrate
php artisan db:seed
php artisan tinker
php artisan test
php artisan config:clear  # À lancer après changement .env
```

## Structure du projet

```
app/
  Http/
    Controllers/    AuthController · TruckController · TruckAdminController
    Requests/       StoreTruckRequest · UpdateTruckRequest
    Middleware/     SecurityHeaders
  Models/           User · FoodTruck · Cuisine · Location · Schedule
  Mail/             TruckRegisteredMail
  Providers/        AppServiceProvider (Inertia::share, CarbonImmutable, URL::forceScheme)

resources/
  js/
    pages/          Home.vue · Register/Index.vue · Auth/* · Admin/*
    Components/     Map/ · Forms/ · ui/
    Composables/    useMap.js · useTrucks.js · useGeocoding.js
  css/app.css       Tokens Tailwind (@theme) — 8 couleurs, Inter 400/500

database/
  migrations/
  seeders/          CuisineSeeder · UserSeeder (local uniquement)

docker/
  entrypoint.sh     Health check DB → migrate → supervisord
```

## Documentation

| Document | Contenu |
|---|---|
| [docs/base/ARCHITECTURE.md](docs/base/ARCHITECTURE.md) | Architecture backend/frontend, conventions de code |
| [docs/base/DESIGN_SYSTEM.md](docs/base/DESIGN_SYSTEM.md) | Tokens CSS, composants UI, typographie |
| [docs/base/CAHIER_DES_CHARGES.md](docs/base/CAHIER_DES_CHARGES.md) | Spécifications fonctionnelles V1 |
| [docs/base/DEPLOY.md](docs/base/DEPLOY.md) | Déploiement Docker + Dokploy |
| [docs/todo/backlog.md](docs/todo/backlog.md) | Backlog produit |

---

*Développé avec [Claude Code](https://claude.ai/code).*
