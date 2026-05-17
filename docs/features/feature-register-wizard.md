# Feature: Registration Wizard

**Status:** ✅ Shipped (Sprint 1)  
**Routes:** `GET /enregistrer`, `POST /trucks`  
**Page:** `resources/js/pages/Register/Index.vue`

---

## User Story

> As a food truck owner, I want to register my truck in 3 simple steps so that it appears on the public map with my schedule and location.

---

## Functional Spec

### Flow Overview

```
Step 1 — Mon truck        Step 2 — Emplacement       Step 3 — Horaires
[name, cuisine,     ]  →  [address autocomplete, ]  →  [days chips,      ]
[description, photo,]     [mini-map click-to-pin,]     [opens_at/closes_at,]
[phone, instagram   ]     [lat/lng readonly       ]     [recurring toggle  ]
                                    ↓
                          POST /trucks (multipart/form-data)
                                    ↓
                          Redirect → / with flash success
```

### Step 1 — Truck Info

| Field | Required | Notes |
|-------|----------|-------|
| Name | ✅ | max 255 — duplicate check via `GET /api/trucks/check-name`, debounce 400ms, warning if found |
| Cuisine | ✅ | chips (single select), maps to `cuisine_id` UUID |
| Description | — | textarea, max 1000 chars |
| Email | — | nullable email — receives confirmation mail after registration |
| Photo | — | image upload, max 2MB, stored in `storage/app/public/trucks/` |
| Phone | — | max 30 chars |
| Instagram | — | handle without `@`, stored as-is |

### Step 2 — Location

| Field | Required | Notes |
|-------|----------|-------|
| Address | ✅ | Nominatim autocomplete, debounced 350ms |
| Latitude | ✅ | Auto-filled from map click or suggestion |
| Longitude | ✅ | Auto-filled from map click or suggestion |
| Place name | — | e.g. "Marché des Enfants Rouges" |

**Mini-map behavior:**
- Leaflet map, same CartoDB Positron tiles as main map
- Click anywhere on map → places/moves the pin, fills lat/lng
- Select a Nominatim suggestion → map flies to location + places pin + fills address/city fields
- `onMounted` restores existing pin if form already has lat/lng (back navigation)

### Step 3 — Schedule

| Field | Required | Notes |
|-------|----------|-------|
| Days | ✅ | Multi-select chips Mon–Sun, stored as `0=Mon … 6=Sun` |
| Opens at | ✅ | `HH:MM` time input |
| Closes at | ✅ | `HH:MM` time input, must be after opens_at |
| Recurring | — | Toggle: "Chaque semaine" vs "Date ponctuelle". Default: recurring |

One `Schedule` row is created per selected day.

### Validation

Client-side (Vue): basic presence checks before `next()` allows advancing step.  
Server-side (Laravel): full `StoreTruckRequest` — runs on `POST /trucks`.

Validation error messages are in French (defined in `StoreTruckRequest::messages()`).

### StepIndicator

Three circles connected by lines:
- **Past step** (`index < current`): green background, ✓ checkmark
- **Current step** (`index === current`): coral background, step number
- **Future step** (`index > current`): white background, gray border, step number
- Connecting line: green if past, gray if future

---

## Data Flow

```
Vue: Register/Index.vue
  → useForm({ name, cuisine_id, ..., days, opens_at, closes_at, is_recurring })
  → Step 1 / 2 / 3 components (share same `form` object via prop)
  → form.post('/trucks', { forceFormData: true })

PHP: TruckController@store
  → StoreTruckRequest validates all fields
  → FoodTruck::create(...)
  → Location::create(...)
  → foreach days → Schedule::create(...)
  → redirect('/')->with('success', "...")

Vue: Home.vue
  → page.props.flash.success displayed as toast
```

---

## Key Technical Points

- **Single `useForm` across 3 steps** — Inertia's `useForm` holds the entire form state. Steps 1, 2, 3 all receive `form` as a prop and mutate it directly. No step-local state.
- **`forceFormData: true`** — required for `multipart/form-data` submission (photo file upload).
- **No Ziggy / `route()` helper** — submission uses the string `/trucks` directly (Wayfinder is server-type-only in this project).
- **Photo storage** — `$request->file('photo')->store('trucks', 'public')` → accessible at `/storage/trucks/<filename>` after `php artisan storage:link`.
- **Nominatim rate limit** — requests are debounced 350ms and only fire when query is ≥ 3 chars. Per Nominatim policy: max 1 req/sec.

---

## Key Files

| File | Role |
|------|------|
| `app/Http/Controllers/TruckController.php` | `create()` (render page) + `store()` (persist) |
| `app/Http/Requests/StoreTruckRequest.php` | Full validation rules + French error messages |
| `app/Models/FoodTruck.php` | `$fillable`, UUID, relations |
| `app/Models/Location.php` | `$fillable`, UUID, lat/lng casts |
| `app/Models/Schedule.php` | `$fillable`, UUID, day_of_week convention |
| `resources/js/pages/Register/Index.vue` | Wizard orchestrator, useForm, step navigation |
| `resources/js/Components/Forms/StepIndicator.vue` | Progress bar |
| `resources/js/Components/Forms/Step1Info.vue` | Truck info fields |
| `resources/js/Components/Forms/Step2Location.vue` | Mini-map + Nominatim |
| `resources/js/Components/Forms/Step3Schedule.vue` | Day chips + hours |
| `resources/js/Composables/useGeocoding.js` | Nominatim API wrapper |

---

## Future Improvements (see backlog)

- [x] Email confirmation to truck owner after registration
- [x] Duplicate truck name detection
- [ ] Allow multiple location slots per truck
- [ ] Allow multiple time slots per day (morning + evening)
- [ ] Edit/delete truck (requires authentication)
