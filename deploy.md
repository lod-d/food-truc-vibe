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

La carte s'affiche centrée sur la France (zoom 6) avec un overlay "Où cherchez-vous ?". Aucun truck n'est chargé tant que l'utilisateur n'a pas :
- activé la géolocalisation → flyTo zoom 13 → bounds → fetch
- sélectionné une ville → lat/lng → fetch dans le rayon choisi (10/25/50/100 km)

Cela évite de charger tous les trucks de France inutilement au premier rendu.

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
