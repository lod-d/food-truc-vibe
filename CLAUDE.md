# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev (serveur Laravel + Vite en parallèle)
composer run dev        # lance php artisan serve + queue + logs + npm run dev

# Frontend seul
npm run dev
npm run build
npm run lint            # ESLint
npm run format          # Prettier
npm run types:check     # vue-tsc

# Backend
php artisan serve
php artisan migrate
php artisan db:seed     # 10 cuisines via CuisineSeeder
php artisan config:clear

# Tests (Pest)
php artisan test
php artisan test --filter=NomDuTest
```

## Stack

- **Laravel 13** + **Inertia.js v2** (pas d'API REST séparée pour les pages — Inertia rend les pages Vue côté serveur)
- **Vue 3 + TypeScript** — pages dans `resources/js/pages/`, composants dans `resources/js/Components/`
- **Tailwind CSS v4** — config CSS-first dans `resources/css/app.css` via `@theme`, pas de `tailwind.config.js`
- **Leaflet.js** + `leaflet.markercluster` pour la carte interactive
- **MySQL 8** — `127.0.0.1:3306`, base `truckmap`, user `root`, pas de mot de passe

## Routing — Wayfinder, pas Ziggy

Le projet utilise `@laravel/vite-plugin-wayfinder` (types TypeScript pour les routes), **pas Ziggy**. Côté Vue, utiliser les URLs directes :

```ts
// ✅ correct
href="/"
href="/enregistrer"
form.post('/trucks')

// ❌ interdit — pas de helper route() disponible côté client
route('home')
```

## Architecture

### Backend

`HomeController@index` passe les trucks ouverts aujourd'hui via Inertia props (pas d'appel API au premier rendu). `TruckController` gère à la fois les pages Inertia (`create`) et l'API JSON (`index` avec filtre Haversine, `show`, `store`).

`AppServiceProvider` configure :
- `CarbonImmutable` comme classe de date par défaut → tous les type hints Eloquent utilisent `CarbonInterface`
- `Inertia::share` pour `cuisines`, `flash.success/error`, et `auth.user` (id + name, null si guest)

`AuthController` gère login/register/logout (sessions Laravel standard, pas Breeze). Routes guest-only : `/connexion`, `/inscription`. `/enregistrer` et `/mon-truck/*` protégés par middleware `auth`.

`TruckAdminController` — ownership vérifié via `abort_if($truck->user_id !== Auth::id(), 403)`. Update = delete location + recreate (plus simple qu'un diff de schedules).

Pas de classes `ApiResource` — le JSON est mappé manuellement dans les controllers pour garder le contrôle du shape.

`day_of_week` dans `schedules` : `0=Lun … 6=Dim` (pas la convention Carbon où `0=Dim`). La conversion est dans `Schedule::scopeOpenToday`.

### Frontend

Les composables sont le cœur de la logique frontend :

- **`useMap.js`** — wraps Leaflet : `init(onBoundsChange?)`, `setTrucks()`, `flyTo()`, `showUserLocation()`. Utilise `clearLayers()` + `addLayers()` pour les perfs. Monte `TruckPopup.vue` via `createApp` dans chaque popup Leaflet (cleanup via `popupApps[]`). Émet les bounds via callback `onBoundsChange` sur `moveend` (actif si zoom ≥ 10).
- **`useTrucks.js`** — fetch réactif vers `/api/trucks` avec `watch(filters, fetch, { deep: true })`. Filtres : `cuisine`, `openNow`, `name` (LIKE), `bounds` (lat/lng viewport), `date` (YYYY-MM-DD). Pagination 20/page via `loadMore()` + `hasMore`. Expose `today` (date du jour en YYYY-MM-DD).
- **`useGeocoding.js`** — Nominatim (OpenStreetMap), limité à la France, debounce 350ms, min 3 chars. Max 1 req/sec (règle Nominatim).

`MapView.vue` wraps `useMap` et expose `flyTo` + `showUserLocation` via `defineExpose`. `Home.vue` orchestre tout via `mapViewRef`.

Le wizard d'enregistrement utilise **un seul `useForm` Inertia** partagé entre les 3 steps via prop. `forceFormData: true` est requis pour l'upload photo.

## Design System

Défini dans `resources/css/app.css` avec `@theme`. **8 tokens uniquement** — ne pas en ajouter d'autres :

| Token | Hex | Usage |
|---|---|---|
| `coral-400` | `#D85A30` | CTA, markers ouverts, accents |
| `coral-600` | `#993C1D` | Hover état primaire |
| `coral-50` | `#FAECE7` | Fond badges cuisine, surfaces actives |
| `warm-50` | `#F1EFE8` | Fond de page |
| `warm-200` | `#D3D1C7` | Borders, séparateurs |
| `warm-900` | `#2C2C2A` | Texte principal |
| `open-50` | `#EAF3DE` | Fond badge "ouvert" |
| `open-600` | `#639922` | Texte badge "ouvert", indicateur |

Typo : **Inter 400 + 500 uniquement**. Pas de `font-bold` / `font-semibold`.

Référence visuelle complète : `docs/base/TRUCKMAP_VISUALS.pdf`

## Docs

Tout changement implique une mise à jour des fichiers concernés :
- `docs/todo/backlog.md` — items non planifiés
- `docs/sprints/` — un fichier par sprint
- `docs/features/` — spec par feature
