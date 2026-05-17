# Feature: Interactive Map View

**Status:** ✅ Shipped (Sprint 1)  
**Route:** `GET /`  
**Page:** `resources/js/pages/Home.vue`

---

## User Story

> As a user, I want to see all food trucks on an interactive map so I can discover what's near me and filter by cuisine or opening status.

---

## Functional Spec

### Map

- Centered on France (`[46.603354, 1.888334]`, zoom 6) on initial load
- Tiles: CartoDB Positron (light, neutral, no API key required, free < 75k tiles/day)
- Zoom control: bottom-right
- Markers: custom teardrop shape with cuisine emoji, coral (#D85A30) when open, gray (#888780) when closed
- Clustering: `Leaflet.markercluster` — `clearLayers()` + `addLayers()` for performance
- Clicking a marker selects the truck and highlights it in the side panel
- `flyTo(lat, lng, zoom=14)` animates the map when clicking a truck card

### Layout (desktop ≥ 768px)

- **Carte** : `flex-1`, occupe toute la hauteur disponible (`h-[calc(100vh-56px)]`)
- **Panel droite** : 288px (`md:`) / 320px (`lg:`), `border-l`
  - Header : compteur "X trucks trouvés" + input recherche par nom (debounce 300ms) + date picker (reset "Aujourd'hui" si non-today)
  - Corps : liste scrollable de `AppCard` par truck, 20/page, bouton "Charger plus" si `hasMore`
  - Card sélectionnée : `border-coral-400 ring-1 ring-coral-400`
- **Navbar** : chips cuisine emoji (visuelles, `AppLayout.vue`) entre le logo et le CTA
- **Barre chips cuisine** (sous le bloc carte+panel) : `SearchBar` horizontal, desktop uniquement
- **Toggle "Ouverts aujourd'hui"** : overlay absolu `bottom-6 left-3` sur la carte
- **Bouton "Me localiser"** : overlay absolu `bottom-6 right-14` sur la carte

### Bottom Sheet (mobile < 768px)

- Fixed to bottom, 45vh height, scrollable
- `rounded-t-2xl` top corners, drag handle visual hint
- Contient : date picker + toggle ouvert + recherche par nom + chips cuisine (`SearchBar`) + liste trucks

### Filters

| Filter | Comportement |
|--------|---------|
| Cuisine chip | `GET /api/trucks?cuisine=<slug>` — mutually exclusive |
| "Tous" chip | Clears cuisine filter |
| Toggle "Ouverts aujourd'hui" | `GET /api/trucks?open_now=1` — overlay carte (desktop) / bottom sheet (mobile) |
| Recherche par nom | `GET /api/trucks?name=<query>` — LIKE search, debounce 300ms, panel header (desktop) + bottom sheet (mobile) |
| Map bounds | `GET /api/trucks?min_lat=&max_lat=&min_lng=&max_lng=` — auto-triggered on `moveend` quand zoom ≥ 10 |
| Date picker | `GET /api/trucks?date=YYYY-MM-DD` — panel desktop + bottom sheet mobile ; reset "Aujourd'hui" visible si date ≠ today |
| Filters combined | All params sent simultaneously |

Filter changes trigger `useTrucks` to re-fetch via `watch(filters, fetch, { deep: true })`.

### Initial Data

`HomeController@index` passes `initialTrucks` (trucks open today) via Inertia props — no API call needed on first paint.

### Flash Message

On return from registration wizard, a `success` flash message appears for 1 session, centered below the navbar.

---

## Data Flow

```
PHP: HomeController@index
  → FoodTruck::with(['cuisine', 'locations.schedules' => openToday()])
  → Inertia::render('Home', ['initialTrucks' => ...])

Vue: Home.vue
  → useTrucks(initialTrucks)     ← initializes with SSR data
  → watch(filters) → fetch()     ← re-fetches on filter change
  → MapView.vue                  ← renders markers via useMap
  → SearchBar.vue                ← emits filter changes
  → AppCard list                 ← truck list panel
```

---

## API Shape (per truck)

```json
{
  "id": "uuid",
  "name": "string",
  "cuisine": { "name": "string", "emoji": "string", "slug": "string" },
  "photo_url": "string|null",
  "instagram_url": "string|null",
  "phone": "string|null",
  "locations": [{
    "id": "uuid",
    "address": "string",
    "city": "string",
    "latitude": 48.8679,
    "longitude": 2.3636,
    "place_name": "string|null",
    "is_open_today": true,
    "is_open_now": true,
    "todays_schedule": { "opens_at": "11:00:00", "closes_at": "15:00:00" }
  }]
}
```

---

## Key Files

| File | Role |
|------|------|
| `app/Http/Controllers/HomeController.php` | Inertia page + initial truck data |
| `app/Http/Controllers/TruckController.php` | `index()` — API with filters + Haversine |
| `app/Models/Schedule.php` | `scopeOpenToday`, `scopeOpenNow` |
| `resources/js/pages/Home.vue` | Main page component |
| `resources/js/Composables/useMap.js` | Leaflet init, markers, clusters |
| `resources/js/Composables/useTrucks.js` | API fetch + reactive filters |
| `resources/js/Components/Map/MapView.vue` | Leaflet wrapper |
| `resources/js/Components/Map/SearchBar.vue` | Cuisine chips (toggle extrait vers Home.vue) |
| `resources/js/Layouts/AppLayout.vue` | Navbar + chips emoji cuisine |
| `resources/js/Components/Map/TruckPopup.vue` | Marker popup content |

---

## Future Improvements (see backlog)

- [x] Geolocation button ("locate me")
- [x] Filter by map bounds (only fetch visible trucks)
- [x] Truck search by name
- [x] Responsive desktop popup (Leaflet popup via `createApp`)
- [x] Date picker to view future schedules
- [x] Pagination for the truck list panel
