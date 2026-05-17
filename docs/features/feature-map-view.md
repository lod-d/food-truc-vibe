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

### Side Panel (desktop ≥ 768px)

- Fixed-width: 288px (`md:`) / 320px (`lg:`)
- Top section: `SearchBar` (cuisine chips + open-now toggle)
- Bottom section: scrollable truck list (`AppCard` per truck)
- Selected truck card highlighted with `border-coral-400 ring-1 ring-coral-400`

### Bottom Sheet (mobile < 768px)

- Fixed to bottom, 45vh height, scrollable
- `rounded-t-2xl` top corners, drag handle visual hint
- Contains same filters + truck list as desktop panel

### Filters

| Filter | Behavior |
|--------|---------|
| Cuisine chip | `GET /api/trucks?cuisine=<slug>` — mutually exclusive |
| "Tous" chip | Clears cuisine filter |
| Open now toggle | `GET /api/trucks?open_now=1` |
| Filters combined | Both params sent simultaneously |

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
| `resources/js/Components/Map/SearchBar.vue` | Cuisine chips + toggle |
| `resources/js/Components/Map/TruckPopup.vue` | Marker popup content |

---

## Future Improvements (see backlog)

- [x] Geolocation button ("locate me")
- [ ] Filter by map bounds (only fetch visible trucks)
- [ ] Date picker to view future schedules
- [ ] Pagination for the truck list panel
