# TruckMap — Cahier des charges V1 (Beta)

> Contexte : application web permettant aux food trucks d'afficher leurs emplacements et horaires sur une carte interactive. Enregistrement public sans authentification pour la V1.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Laravel 13 |
| Frontend | Vue 3 Composition API |
| Bridge | Inertia.js v3 |
| Style | Tailwind CSS v4 |
| Base de données | MySQL 8 |
| Carte | Leaflet.js + Leaflet.markercluster |
| Starter kit | Laravel Breeze (Vue + Inertia) |

### Installation initiale

```bash
composer create-project laravel/laravel truckmap
cd truckmap
composer require laravel/breeze --dev
php artisan breeze:install vue
npm install
npm install leaflet leaflet.markercluster @vueuse/core @tailwindcss/forms
```

---

## Architecture des fichiers

```
resources/js/
├── Components/
│   ├── ui/
│   │   ├── AppButton.vue
│   │   ├── AppBadge.vue
│   │   ├── AppInput.vue
│   │   └── AppCard.vue
│   ├── Map/
│   │   ├── MapView.vue          ← composant Leaflet principal
│   │   ├── TruckPopup.vue       ← popup sur marker
│   │   └── SearchBar.vue        ← recherche + filtres cuisine
│   └── Forms/
│       ├── StepIndicator.vue
│       ├── Step1Info.vue        ← infos truck
│       ├── Step2Location.vue    ← emplacement + mini-carte
│       └── Step3Schedule.vue    ← horaires récurrents
├── Composables/
│   ├── useMap.js                ← init Leaflet, markers, clustering
│   ├── useTrucks.js             ← fetch /api/trucks + filtres
│   └── useGeocoding.js          ← Nominatim (OpenStreetMap, gratuit)
├── Pages/
│   ├── Home.vue                 ← page carte publique
│   └── Register/
│       └── Index.vue            ← wizard 3 étapes
└── Layouts/
    └── AppLayout.vue
```

---

## Base de données

### Tables

#### `cuisines`
```sql
id           uuid PK
name         varchar(100)   -- "Burger", "Tacos", "Asiatique"...
slug         varchar(100)   -- "burger", "tacos"
emoji        varchar(10)    -- "🍔"
created_at   timestamp
updated_at   timestamp
```

#### `food_trucks`
```sql
id              uuid PK
cuisine_id      uuid FK → cuisines.id
name            varchar(255)
description     text nullable
phone           varchar(30) nullable
email           varchar(255) nullable
instagram_url   varchar(255) nullable
photo_url       varchar(255) nullable
created_at      timestamp
updated_at      timestamp
```

#### `locations`
```sql
id              uuid PK
food_truck_id   uuid FK → food_trucks.id
address         varchar(255)
city            varchar(100)
postal_code     varchar(10) nullable
latitude        decimal(10,7)
longitude       decimal(10,7)
place_name      varchar(255) nullable  -- "Marché des Enfants Rouges"
created_at      timestamp
updated_at      timestamp
```

#### `schedules`
```sql
id              uuid PK
location_id     uuid FK → locations.id
day_of_week     tinyint nullable        -- 0=Lun … 6=Dim (si récurrent)
opens_at        time
closes_at       time
specific_date   date nullable           -- pour dates ponctuelles
is_recurring    boolean default true
is_cancelled    boolean default false
created_at      timestamp
updated_at      timestamp
```

### Relations Eloquent

```
Cuisine → hasMany → FoodTruck
FoodTruck → belongsTo → Cuisine
FoodTruck → hasMany → Location
Location → belongsTo → FoodTruck
Location → hasMany → Schedule
Schedule → belongsTo → Location
```

---

## Routes

```php
// web.php
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/enregistrer', [TruckController::class, 'create'])->name('trucks.create');
Route::post('/trucks', [TruckController::class, 'store'])->name('trucks.store');

// api.php (ou préfixe /api dans web.php)
Route::get('/api/trucks', [TruckController::class, 'index']);
Route::get('/api/trucks/{id}', [TruckController::class, 'show']);
Route::get('/api/cuisines', [CuisineController::class, 'index']);
```

### Paramètres GET `/api/trucks`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `lat` | float | Latitude centre de recherche |
| `lng` | float | Longitude centre de recherche |
| `radius` | int | Rayon en km (défaut : 50) |
| `cuisine` | string | Slug cuisine (ex: "burger") |
| `date` | string | Format Y-m-d (défaut : aujourd'hui) |
| `open_now` | bool | Filtrer uniquement les trucks ouverts |

---

## Logique "ouvert maintenant"

Le calcul se fait en PHP dans le scope Eloquent, pas en JS.

```php
// Dans Schedule.php
public function scopeOpenToday(Builder $query, Carbon $date): Builder
{
    return $query->where(function ($q) use ($date) {
        // Récurrent : jour de la semaine correspond
        $q->where('is_recurring', true)
          ->where('day_of_week', $date->dayOfWeek) // 0=Dim en Carbon, adapter
          ->where('is_cancelled', false);
    })->orWhere(function ($q) use ($date) {
        // Ponctuel : date exacte
        $q->where('specific_date', $date->toDateString())
          ->where('is_cancelled', false);
    });
}

public function scopeOpenNow(Builder $query): Builder
{
    $now = now();
    return $query->openToday($now)
        ->where('opens_at', '<=', $now->toTimeString())
        ->where('closes_at', '>=', $now->toTimeString());
}
```

---

## Réponse JSON `/api/trucks`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Burger Bros",
      "cuisine": { "name": "Burger", "emoji": "🍔", "slug": "burger" },
      "photo_url": "https://...",
      "instagram_url": "@burgerbros",
      "locations": [
        {
          "id": "uuid",
          "address": "Place de la République",
          "city": "Paris",
          "latitude": 48.8679,
          "longitude": 2.3636,
          "place_name": null,
          "is_open_today": true,
          "is_open_now": true,
          "todays_schedule": {
            "opens_at": "11:00",
            "closes_at": "15:00"
          }
        }
      ]
    }
  ]
}
```

---

## Composables Vue clés

### `useGeocoding.js`

```js
// Nominatim — OpenStreetMap, sans clé API
export function useGeocoding() {
  const search = async (query) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5`,
      { headers: { 'Accept-Language': 'fr' } }
    )
    return res.json()
  }
  return { search }
}
```

### `useMap.js` (structure)

```js
import L from 'leaflet'
import 'leaflet.markercluster'

export function useMap(containerRef) {
  let map = null
  let clusterGroup = null

  const init = () => {
    map = L.map(containerRef.value, {
      center: [46.603354, 1.888334], // centre France
      zoom: 6,
      zoomControl: false,
    })

    // Tiles CartoDB Positron (fond neutre élégant)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map)

    // Zoom control en bas à droite
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Cluster group
    clusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `<div class="truck-cluster">${cluster.getChildCount()}</div>`,
          className: '',
          iconSize: L.point(40, 40),
        })
      },
    })
    map.addLayer(clusterGroup)
  }

  const setTrucks = (trucks) => {
    // clearLayers + addLayers = méthode la plus performante (voir benchmark)
    clusterGroup.clearLayers()
    const markers = trucks.flatMap(truck =>
      truck.locations.map(loc => {
        const icon = L.divIcon({
          html: `<div class="truck-marker ${loc.is_open_now ? 'open' : 'closed'}">${truck.cuisine.emoji}</div>`,
          className: '',
          iconSize: L.point(40, 40),
          iconAnchor: L.point(20, 40),
        })
        const marker = L.marker([loc.latitude, loc.longitude], { icon })
        marker.bindPopup('') // contenu géré par TruckPopup.vue via teleport
        marker.on('click', () => { /* émettre event vers Home.vue */ })
        return marker
      })
    )
    clusterGroup.addLayers(markers)
  }

  return { init, setTrucks }
}
```

---

## Design system — tokens Tailwind

À définir dans `resources/css/app.css` (Tailwind v4) :

```css
@import "tailwindcss";

@theme {
  /* Couleurs */
  --color-coral-50:  #FAECE7;
  --color-coral-100: #F5C4B3;
  --color-coral-400: #D85A30;   /* primaire */
  --color-coral-600: #993C1D;   /* hover */

  --color-warm-50:   #F1EFE8;   /* fond page */
  --color-warm-200:  #D3D1C7;   /* borders */
  --color-warm-900:  #2C2C2A;   /* texte principal */

  --color-open-50:   #EAF3DE;
  --color-open-600:  #639922;

  /* Typographie */
  --font-family-sans: 'Inter', system-ui, sans-serif;

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;

  /* Spacing */
  --spacing-section: 2rem;
}
```

### Classes utilitaires récurrentes

```
Bouton primaire  : bg-coral-400 hover:bg-coral-600 text-white rounded-md px-5 py-2.5 font-medium
Bouton secondaire: border border-warm-200 hover:bg-warm-50 rounded-md px-5 py-2.5
Badge ouvert     : bg-open-50 text-open-600 rounded-full px-3 py-0.5 text-xs font-medium
Badge fermé      : bg-warm-50 text-warm-400 rounded-full px-3 py-0.5 text-xs
Badge cuisine    : bg-coral-50 text-coral-600 rounded-full px-3 py-0.5 text-xs
Input            : border border-warm-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-coral-400 focus:border-transparent
Card             : bg-white border border-warm-200 rounded-lg p-4
```

---

## Marker Leaflet custom (CSS)

```css
/* Dans resources/css/app.css */
.truck-marker {
  width: 40px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #D85A30;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}

.truck-marker .emoji {
  transform: rotate(45deg);
}

.truck-marker.closed {
  background: #888780;
  opacity: .7;
}

.truck-cluster {
  width: 40px;
  height: 40px;
  background: #D85A30;
  border: 3px solid rgba(216, 90, 48, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 500;
}
```

---

## Wizard enregistrement — flow

```
Step 1 — Infos truck
  - Nom *
  - Type de cuisine * (chips sélectionnables)
  - Description (textarea)
  - Photo (upload optionnel)
  - Téléphone
  - Instagram

Step 2 — Emplacement
  - Champ adresse avec autocomplétion Nominatim
  - Mini-carte Leaflet : clic pour placer le marker
  - Lat/Lng en lecture (remplis auto au clic sur la carte)
  - Nom du lieu (optionnel)

Step 3 — Horaires
  - Sélection des jours (chips Lun–Dim, multi-select)
  - Heure d'ouverture / fermeture
  - Type : récurrent (chaque semaine) ou date ponctuelle
  - Possibilité d'ajouter plusieurs créneaux

Validation : côté client (Vue) + côté serveur (FormRequest Laravel)
Confirmation : message succès + lien vers la carte avec le truck affiché
```

---

## Checklist V1 Beta

### Backend
- [ ] Migrations (cuisines, food_trucks, locations, schedules)
- [ ] Models + Relations Eloquent
- [ ] Seeders cuisines (10 types courants)
- [ ] TruckController → index (API JSON) + store (wizard)
- [ ] TruckRequest (validation Laravel)
- [ ] Scope `openToday` + `openNow` sur Schedule
- [ ] HomeController → passe les cuisines à Inertia

### Frontend
- [ ] AppLayout.vue (navbar minimale)
- [ ] Home.vue (carte + panel liste + filtres)
- [ ] MapView.vue (Leaflet init, markers custom, clusters)
- [ ] TruckPopup.vue
- [ ] SearchBar.vue (input + chips cuisine + toggle "ouvert")
- [ ] Register/Index.vue (stepper)
- [ ] Step1Info.vue
- [ ] Step2Location.vue (mini-carte Leaflet + Nominatim)
- [ ] Step3Schedule.vue
- [ ] useMap.js
- [ ] useTrucks.js
- [ ] useGeocoding.js

### Design
- [ ] Tokens Tailwind v4 dans app.css
- [ ] CSS markers Leaflet
- [ ] CSS cluster Leaflet
- [ ] Responsive mobile (carte plein écran, panel en bottom sheet)

---

## Variables d'environnement `.env`

```env
APP_NAME=TruckMap
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=

# Geocoding : Nominatim ne nécessite pas de clé API
# Tiles : CartoDB Positron — gratuit sans clé pour usage raisonnable
```

---

## Commandes utiles

```bash
# Démarrer le projet
php artisan serve
npm run dev

# Créer les migrations
php artisan make:migration create_cuisines_table
php artisan make:migration create_food_trucks_table
php artisan make:migration create_locations_table
php artisan make:migration create_schedules_table

# Modèles
php artisan make:model Cuisine
php artisan make:model FoodTruck
php artisan make:model Location
php artisan make:model Schedule

# Controllers
php artisan make:controller HomeController
php artisan make:controller TruckController
php artisan make:controller CuisineController

# Request
php artisan make:request StoreTruckRequest

# Seeder
php artisan make:seeder CuisineSeeder
php artisan db:seed --class=CuisineSeeder

# Lancer les migrations
php artisan migrate
php artisan migrate:fresh --seed
```
