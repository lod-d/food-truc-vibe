# TruckMap — Guide de déploiement

## Stack requise

| Outil | Version |
|---|---|
| PHP | 8.2+ |
| Laravel | 13 |
| Node.js | 20+ |
| MySQL | 8 |
| Composer | 2+ |

## Installation locale

```bash
# 1. Dépendances
composer install
npm install

# 2. Environnement
cp .env.example .env
php artisan key:generate

# 3. Base de données (MySQL 8, base "truckmap", user root, pas de mot de passe)
php artisan migrate
php artisan db:seed   # insère les 10 types de cuisine

# 4. Lancer le serveur (Laravel + Vite en parallèle)
composer run dev
```

L'app est accessible sur `http://localhost:8000`.

---

## Variables d'environnement clés

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=
```

---

## Architecture

### Backend

- **Laravel 13 + Inertia.js v2** — pas d'API REST séparée pour les pages
- **`HomeController`** — rend la page Home sans données initiales (les trucks sont chargés côté client après interaction)
- **`TruckController`** — API JSON `/api/trucks` avec filtres : cuisine, openNow, name, bounds (viewport Haversine), lat/lng/radius, date
- **`AuthController`** — login / register / logout (sessions Laravel standard)
- **`TruckAdminController`** — CRUD truck pour le propriétaire (ownership vérifié via `user_id`)

### Frontend

- **Vue 3 + TypeScript**, pages dans `resources/js/pages/`
- **`useTrucks.js`** — fetch réactif vers `/api/trucks`. Ne charge rien au démarrage : attend qu'une zone soit définie (géoloc ou ville) avant le premier appel API
- **`useMap.js`** — wraps Leaflet, émet les bounds au `moveend` si zoom ≥ 10
- **`useGeocoding.js`** — Nominatim (OSM), limité France, debounce 350ms

### Comportement carte au démarrage

La carte s'affiche centrée sur la France (zoom 6). `useTrucks` fait un fetch initial au mount → les 20 premiers trucks ouverts à la date du jour sont affichés en clusters Leaflet sur toute la France.

À chaque pan / zoom (≥ 10), `useMap` émet les bounds → `useTrucks` refetch sur le viewport. La géoloc et la sélection de ville déclenchent juste un `flyTo` (le `moveend` qui suit pilote le refetch).

---

## Commandes utiles

```bash
# Repartir de zéro (purge toutes les données)
php artisan migrate:fresh --seed

# Build production
npm run build

# Lint / types
npm run lint
npm run types:check

# Tests (Pest)
php artisan test
```

---

## Environnement de démo

Une instance de démo publique tourne sur **https://demo-truck.deladev.fr** (branche `demo`, hébergée sur Dokploy).

### Variables clés

```env
APP_ENV=demo
APP_DEBUG=false
LOG_LEVEL=warning
MAIL_MAILER=log
```

Template complet : [.env.demo.example](.env.demo.example).

### Credentials

| Compte | Email | Password |
|--------|-------|----------|
| Démo (10 trucks ownés) | `demo@truckmap.fr` | `demo` |

Affichés sur la page `/connexion` (bandeau coral) quand `APP_ENV=demo`. Pré-remplissage en 1 clic.

### Reset automatique

Un cron Laravel reset la base chaque nuit à **04:00 Europe/Paris** :

```php
// routes/console.php
if (app()->environment('demo')) {
    Schedule::command('demo:reset')->dailyAt('04:00')->timezone('Europe/Paris');
}
```

Sur le serveur, ajouter dans le crontab :

```cron
* * * * * cd /var/www/truckmap-demo && php artisan schedule:run >> /dev/null 2>&1
```

Reset manuel : `APP_ENV=demo php artisan demo:reset` (bloqué hors démo).

### Volume seedé en démo

| Table | Count |
|-------|-------|
| `users` | 41 (1 dev + 40 fake + 1 demo) |
| `food_trucks` | ~310 (300 fake + 10 démo ownés) |
| `locations` | ~310 |
| `schedules` | ~1450 (1345 fake + 10 démo × 7 jours) |

### Comportement spécifique

- `MAIL_MAILER=log` — aucun mail envoyé. Les `TruckRegisteredMail` finissent dans `storage/logs/laravel.log`.
- `Inertia::share('isDemo' => true)` — bandeau de démo affiché sur toutes les pages, dismiss-able via `sessionStorage`.
- Auth throttle déjà actif sur `/connexion` et `/inscription` (10 req/min) — aucun ajustement spécifique démo.

---

## Routes principales

| Méthode | URL | Rôle |
|---|---|---|
| GET | `/` | Page carte |
| GET | `/enregistrer` | Wizard inscription truck (auth) |
| GET | `/connexion` | Login |
| GET | `/inscription` | Register |
| GET | `/mon-truck` | Dashboard propriétaire (auth) |
| GET | `/api/trucks` | Liste trucks JSON (filtres) |
| POST | `/trucks` | Créer un truck |
| PUT | `/mon-truck/{id}` | Modifier son truck |
| DELETE | `/mon-truck/{id}` | Supprimer son truck |
