# Sprint 1 — V1 Beta

**Period:** 2026-05-16 → 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Build and ship the complete V1 Beta — public map + registration wizard, no authentication.

---

## Delivered

### Backend

| Task | File(s) | Status |
|------|---------|--------|
| Switch DB from SQLite → MySQL | `.env` | ✅ |
| Migration: cuisines | `database/migrations/..._create_cuisines_table.php` | ✅ |
| Migration: food_trucks | `database/migrations/..._create_food_trucks_table.php` | ✅ |
| Migration: locations | `database/migrations/..._create_locations_table.php` | ✅ |
| Migration: schedules | `database/migrations/..._create_schedules_table.php` | ✅ |
| Model: Cuisine (UUID, hasMany) | `app/Models/Cuisine.php` | ✅ |
| Model: FoodTruck (UUID, relations) | `app/Models/FoodTruck.php` | ✅ |
| Model: Location (UUID, casts) | `app/Models/Location.php` | ✅ |
| Model: Schedule (UUID, scopeOpenToday, scopeOpenNow) | `app/Models/Schedule.php` | ✅ |
| Seeder: 10 cuisine types | `database/seeders/CuisineSeeder.php` | ✅ |
| HomeController: passes open-today trucks to Inertia | `app/Http/Controllers/HomeController.php` | ✅ |
| TruckController: API index (haversine), show, create, store | `app/Http/Controllers/TruckController.php` | ✅ |
| CuisineController: API list | `app/Http/Controllers/CuisineController.php` | ✅ |
| StoreTruckRequest: 3-step validation | `app/Http/Requests/StoreTruckRequest.php` | ✅ |
| AppServiceProvider: Inertia::share cuisines + flash | `app/Providers/AppServiceProvider.php` | ✅ |
| Routes: web + API | `routes/web.php` | ✅ |

### Frontend

| Task | File(s) | Status |
|------|---------|--------|
| Design system CSS tokens (Tailwind v4 @theme) | `resources/css/app.css` | ✅ |
| Leaflet marker / cluster / popup CSS | `resources/css/app.css` | ✅ |
| Inter font (Google Fonts) | `resources/views/app.blade.php` | ✅ |
| AppButton (primary/secondary/ghost) | `resources/js/Components/ui/AppButton.vue` | ✅ |
| AppBadge (open/closed/cuisine) | `resources/js/Components/ui/AppBadge.vue` | ✅ |
| AppInput (with icon slot) | `resources/js/Components/ui/AppInput.vue` | ✅ |
| AppCard | `resources/js/Components/ui/AppCard.vue` | ✅ |
| useGeocoding (Nominatim, no key) | `resources/js/Composables/useGeocoding.js` | ✅ |
| useMap (Leaflet init, setTrucks, flyTo, clearLayers+addLayers) | `resources/js/Composables/useMap.js` | ✅ |
| useTrucks (fetch + reactive filters) | `resources/js/Composables/useTrucks.js` | ✅ |
| MapView.vue (Leaflet wrapper, exposes flyTo) | `resources/js/Components/Map/MapView.vue` | ✅ |
| TruckPopup.vue | `resources/js/Components/Map/TruckPopup.vue` | ✅ |
| SearchBar.vue (cuisine chips + open-now toggle) | `resources/js/Components/Map/SearchBar.vue` | ✅ |
| StepIndicator.vue | `resources/js/Components/Forms/StepIndicator.vue` | ✅ |
| Step1Info.vue | `resources/js/Components/Forms/Step1Info.vue` | ✅ |
| Step2Location.vue (mini-map + Nominatim autocomplete) | `resources/js/Components/Forms/Step2Location.vue` | ✅ |
| Step3Schedule.vue (day chips + hours) | `resources/js/Components/Forms/Step3Schedule.vue` | ✅ |
| AppLayout.vue (fixed navbar) | `resources/js/Layouts/AppLayout.vue` | ✅ |
| Home.vue (map + panel + bottom sheet mobile) | `resources/js/pages/Home.vue` | ✅ |
| Register/Index.vue (3-step wizard, Inertia useForm) | `resources/js/pages/Register/Index.vue` | ✅ |

### Docs & Repo

| Task | File(s) | Status |
|------|---------|--------|
| README (PRD-style, full code) | `README.md` | ✅ |
| CONTRIBUTING.md | `CONTRIBUTING.md` | ✅ |
| CODE_OF_CONDUCT.md | `CODE_OF_CONDUCT.md` | ✅ |
| SECURITY.md | `SECURITY.md` | ✅ |
| LICENSE (MIT) | `LICENSE` | ✅ |
| docs/todo/backlog.md | `docs/todo/backlog.md` | ✅ |
| docs/sprints/sprint-1-v1-beta.md | this file | ✅ |
| docs/features/feature-map-view.md | `docs/features/feature-map-view.md` | ✅ |
| docs/features/feature-register-wizard.md | `docs/features/feature-register-wizard.md` | ✅ |

---

## Bug Fixed During Sprint

| Bug | Fix |
|-----|-----|
| `scopeOpenToday` type error: `Carbon` vs `CarbonImmutable` | Changed type hint to `CarbonInterface` in `Schedule.php` |
| Queue worker crashing with SQLite path after DB switch | Ran `php artisan config:clear` to flush cached config |

---

## Key Decisions

- **No Ziggy** — project uses Laravel Wayfinder. Vue components use string URLs (`/`, `/enregistrer`, `/trucks`) instead of a `route()` helper.
- **`clearLayers()` + `addLayers()`** on Leaflet.markercluster instead of removing markers one by one — significantly faster for large datasets.
- **`CarbonImmutable`** is the default date class (set in `AppServiceProvider`) — all scope arguments typed as `CarbonInterface` to accept both `Carbon` and `CarbonImmutable`.
- **No API Resource classes** — `TruckController` maps data manually to keep full control of the JSON shape.
- **`day_of_week` mapping** — stored as `0=Mon … 6=Sun`, not Carbon's default (`0=Sun`). Conversion handled in `scopeOpenToday`.
