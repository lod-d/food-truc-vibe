# 🚚 TruckMap

> An interactive web map to discover and register food trucks — built with Laravel 13, Vue 3, Inertia.js, Tailwind CSS v4 and Leaflet.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-13-red)](https://laravel.com)
[![Vue](https://img.shields.io/badge/Vue-3-green)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-blue)](https://tailwindcss.com)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Backend](#backend)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Form Request](#form-request)
  - [Routes](#routes)
  - [Providers](#providers)
- [Frontend](#frontend)
  - [Composables](#composables)
  - [UI Components](#ui-components)
  - [Map Components](#map-components)
  - [Form Components](#form-components)
  - [Pages & Layout](#pages--layout)
  - [CSS](#css)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Project Docs](#project-docs)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TruckMap is a public web application that lets food truck owners register their truck, set their location and schedule, and appear on an interactive map for customers to discover them.

**V1 Beta scope:**
- 🗺️ Interactive map (Leaflet.js + marker clustering) centered on France
- 🔍 Filter by cuisine type and "open now"
- 📋 Truck list panel with real-time sync to the map
- 📝 3-step public registration wizard (no authentication required)
- 📍 Address autocomplete via Nominatim (OpenStreetMap, no API key)
- ✅ "Open now" logic computed server-side in PHP

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | Vue 3 Composition API + TypeScript |
| Bridge | Inertia.js v2 |
| Styling | Tailwind CSS v4 |
| Database | MySQL 8 |
| Map | Leaflet.js + Leaflet.markercluster |
| Geocoding | Nominatim (OpenStreetMap — free, no key) |
| Map tiles | CartoDB Positron (free, no key, < 75k tiles/day) |
| Routing (client) | Laravel Wayfinder |
| Build | Vite |

---

## Architecture

### File Structure

```
resources/js/
├── Components/
│   ├── ui/
│   │   ├── AppButton.vue       ← primary / secondary / ghost variants
│   │   ├── AppBadge.vue        ← open / closed / cuisine variants
│   │   ├── AppInput.vue        ← with optional icon slot
│   │   └── AppCard.vue         ← white bordered card
│   ├── Map/
│   │   ├── MapView.vue         ← Leaflet init, markers, clusters
│   │   ├── TruckPopup.vue      ← marker popup content
│   │   └── SearchBar.vue       ← cuisine chips + open-now toggle
│   └── Forms/
│       ├── StepIndicator.vue   ← 3-step progress bar
│       ├── Step1Info.vue       ← truck name, cuisine, photo, contacts
│       ├── Step2Location.vue   ← address search + mini map
│       └── Step3Schedule.vue   ← days chips + hours + recurring toggle
├── Composables/
│   ├── useMap.js               ← Leaflet init, setTrucks, flyTo
│   ├── useTrucks.js            ← fetch /api/trucks + reactive filters
│   └── useGeocoding.js         ← Nominatim address search
├── Layouts/
│   └── AppLayout.vue           ← navbar + slot
└── pages/
    ├── Home.vue                ← map page (public)
    └── Register/
        └── Index.vue           ← registration wizard

app/
├── Http/
│   ├── Controllers/
│   │   ├── HomeController.php
│   │   ├── TruckController.php
│   │   └── CuisineController.php
│   └── Requests/
│       └── StoreTruckRequest.php
├── Models/
│   ├── Cuisine.php
│   ├── FoodTruck.php
│   ├── Location.php
│   └── Schedule.php
└── Providers/
    └── AppServiceProvider.php  ← Inertia::share cuisines + flash

database/
├── migrations/
│   ├── ..._create_cuisines_table.php
│   ├── ..._create_food_trucks_table.php
│   ├── ..._create_locations_table.php
│   └── ..._create_schedules_table.php
└── seeders/
    └── CuisineSeeder.php       ← 10 cuisine types
```

### Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| PHP Models | PascalCase singular | `FoodTruck`, `Schedule` |
| PHP Controllers | PascalCase + Controller | `TruckController` |
| PHP Migrations | snake_case auto-timestamp | `create_food_trucks_table` |
| PHP Routes | kebab-case | `/enregistrer` |
| Eloquent Scopes | camelCase prefixed `scope` | `scopeOpenNow` |
| Vue Components | PascalCase | `MapView.vue`, `TruckPopup.vue` |
| Vue Composables | camelCase prefixed `use` | `useMap.js` |
| Vue Props | camelCase | `:foodTruck`, `:isOpenNow` |
| Vue Emits | kebab-case | `@truck-selected` |
| CSS | No custom classes except Leaflet | `.truck-marker`, `.truck-cluster` |
| Tailwind | No `@apply` except in `app.css` for markers | — |

---

## Database Schema

### ERD (text)

```
cuisines ──< food_trucks ──< locations ──< schedules
```

### `cuisines`

```sql
id           uuid PK
name         varchar(100)   -- "Burger", "Tacos", "Asiatique"
slug         varchar(100)   -- "burger", "tacos"
emoji        varchar(10)    -- "🍔"
created_at   timestamp
updated_at   timestamp
```

### `food_trucks`

```sql
id              uuid PK
cuisine_id      uuid FK → cuisines.id  (cascade delete)
name            varchar(255)
description     text nullable
phone           varchar(30) nullable
email           varchar(255) nullable
instagram_url   varchar(255) nullable
photo_url       varchar(255) nullable
created_at      timestamp
updated_at      timestamp
```

### `locations`

```sql
id              uuid PK
food_truck_id   uuid FK → food_trucks.id  (cascade delete)
address         varchar(255)
city            varchar(100)
postal_code     varchar(10) nullable
latitude        decimal(10,7)
longitude       decimal(10,7)
place_name      varchar(255) nullable   -- "Marché des Enfants Rouges"
created_at      timestamp
updated_at      timestamp
```

### `schedules`

```sql
id              uuid PK
location_id     uuid FK → locations.id  (cascade delete)
day_of_week     tinyint nullable        -- 0=Mon … 6=Sun
opens_at        time
closes_at       time
specific_date   date nullable           -- for one-off dates
is_recurring    boolean default true
is_cancelled    boolean default false
created_at      timestamp
updated_at      timestamp
```

> **Day mapping:** `day_of_week` uses `0 = Monday … 6 = Sunday` (not Carbon's default). The scope converts Carbon's Sunday=0 accordingly.

### Eloquent Relations

```
Cuisine    → hasMany    → FoodTruck
FoodTruck  → belongsTo  → Cuisine
FoodTruck  → hasMany    → Location
Location   → belongsTo  → FoodTruck
Location   → hasMany    → Schedule
Schedule   → belongsTo  → Location
```

---

## Design System

### Principles

1. **Minimal** — every element has a purpose
2. **Warm** — street food colors, never cold or corporate
3. **Readable** — clear typography, WCAG AA contrast minimum
4. **Consistent** — same components everywhere, same Tailwind classes

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `coral-400` | `#D85A30` | Primary CTAs, open markers, accents |
| `coral-600` | `#993C1D` | Hover state |
| `coral-50` | `#FAECE7` | Cuisine badge background, active surfaces |
| `coral-100` | `#F5C4B3` | Light hover surfaces |
| `warm-50` | `#F1EFE8` | Page background |
| `warm-200` | `#D3D1C7` | Borders, separators |
| `warm-500` | `#888780` | Secondary text, closed markers |
| `warm-900` | `#2C2C2A` | Primary text |
| `open-50` | `#EAF3DE` | "Open" badge background |
| `open-600` | `#639922` | "Open" badge text, green dot |

### Typography

Font: **Inter** (Google Fonts, weights 400 & 500 only)

| Role | Tailwind Class | Size |
|------|---------------|------|
| Page title (H1) | `text-2xl font-medium` | 24px / 500 |
| Section title (H2) | `text-lg font-medium` | 18px / 500 |
| Card/popup title | `text-sm font-medium` | 14px / 500 |
| Body | `text-sm` | 14px / 400 |
| Meta / muted | `text-xs text-warm-500` | 12px / 400 |
| Field label | `text-xs text-warm-500` | 12px / 400 |

### Component Classes

```
Button primary   : bg-coral-400 hover:bg-coral-600 text-white rounded-md px-5 py-2.5 text-sm font-medium transition-colors
Button secondary : border border-warm-200 hover:bg-warm-50 text-warm-900 rounded-md px-5 py-2.5 text-sm transition-colors
Button ghost     : text-coral-400 hover:text-coral-600 text-sm underline-offset-2 hover:underline
Badge open       : bg-open-50 text-open-600 rounded-full px-3 py-0.5 text-xs font-medium
Badge closed     : bg-warm-50 text-warm-500 rounded-full px-3 py-0.5 text-xs
Badge cuisine    : bg-coral-50 text-coral-600 rounded-full px-3 py-0.5 text-xs
Input            : border border-warm-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-coral-400 focus:border-transparent
Card             : bg-white border border-warm-200 rounded-lg p-4
```

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|---------|
| mobile (default) | < 768px | Full-screen map, truck list in bottom sheet |
| `md:` | ≥ 768px | Side-by-side map + panel (288px) |
| `lg:` | ≥ 1024px | Wider panel (320px), filters always visible |

### Leaflet Marker Styles

```css
/* Teardrop pin pointing down, cuisine emoji inside */
.truck-marker {
  width: 40px; height: 40px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #D85A30;       /* open */
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}
.truck-marker.closed { background: #888780; opacity: .65; }
.truck-marker .emoji { transform: rotate(45deg); font-size: 16px; }

/* Cluster bubble */
.truck-cluster {
  width: 40px; height: 40px;
  background: #D85A30;
  border: 3px solid rgba(216,90,48,.25);
  border-radius: 50%;
  color: white; font-size: 13px; font-weight: 500;
}
```

---

## Backend

### Models

#### `app/Models/Cuisine.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cuisine extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'slug', 'emoji'];

    public function foodTrucks(): HasMany
    {
        return $this->hasMany(FoodTruck::class);
    }
}
```

#### `app/Models/FoodTruck.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodTruck extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'cuisine_id', 'name', 'description',
        'phone', 'email', 'instagram_url', 'photo_url',
    ];

    public function cuisine(): BelongsTo
    {
        return $this->belongsTo(Cuisine::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
```

#### `app/Models/Location.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'food_truck_id', 'address', 'city', 'postal_code',
        'latitude', 'longitude', 'place_name',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
    ];

    public function foodTruck(): BelongsTo
    {
        return $this->belongsTo(FoodTruck::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
}
```

#### `app/Models/Schedule.php`

```php
<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'location_id', 'day_of_week', 'opens_at', 'closes_at',
        'specific_date', 'is_recurring', 'is_cancelled',
    ];

    protected $casts = [
        'is_recurring'  => 'boolean',
        'is_cancelled'  => 'boolean',
        'specific_date' => 'date',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    // day_of_week: 0=Mon … 6=Sun
    // Carbon dayOfWeek: 0=Sun, 1=Mon … 6=Sat → remapped here
    public function scopeOpenToday(Builder $query, CarbonInterface $date): Builder
    {
        $dayIndex = $date->dayOfWeek === 0 ? 6 : $date->dayOfWeek - 1;

        return $query->where('is_cancelled', false)
            ->where(function ($q) use ($date, $dayIndex) {
                $q->where(function ($q) use ($dayIndex) {
                    $q->where('is_recurring', true)
                      ->where('day_of_week', $dayIndex);
                })->orWhere(function ($q) use ($date) {
                    $q->where('is_recurring', false)
                      ->whereDate('specific_date', $date->toDateString());
                });
            });
    }

    public function scopeOpenNow(Builder $query): Builder
    {
        $now = now();
        return $query->openToday($now)
            ->where('opens_at', '<=', $now->toTimeString())
            ->where('closes_at', '>=', $now->toTimeString());
    }
}
```

---

### Controllers

#### `app/Http/Controllers/HomeController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\FoodTruck;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $initialTrucks = FoodTruck::with([
            'cuisine:id,name,emoji,slug',
            'locations.schedules' => fn($q) => $q->openToday(now()),
        ])
        ->whereHas('locations.schedules', fn($q) => $q->openToday(now()))
        ->get()
        ->map(fn($truck) => $this->formatTruck($truck));

        return Inertia::render('Home', [
            'initialTrucks' => $initialTrucks,
        ]);
    }

    private function formatTruck(FoodTruck $truck): array
    {
        return [
            'id'            => $truck->id,
            'name'          => $truck->name,
            'cuisine'       => $truck->cuisine->only('name', 'emoji', 'slug'),
            'photo_url'     => $truck->photo_url,
            'instagram_url' => $truck->instagram_url,
            'phone'         => $truck->phone,
            'locations'     => $truck->locations->map(function ($loc) {
                $schedule = $loc->schedules->first();
                return [
                    'id'              => $loc->id,
                    'address'         => $loc->address,
                    'city'            => $loc->city,
                    'latitude'        => (float) $loc->latitude,
                    'longitude'       => (float) $loc->longitude,
                    'place_name'      => $loc->place_name,
                    'is_open_today'   => $schedule !== null,
                    'is_open_now'     => $schedule && $this->isOpenNow($schedule),
                    'todays_schedule' => $schedule ? [
                        'opens_at'  => $schedule->opens_at,
                        'closes_at' => $schedule->closes_at,
                    ] : null,
                ];
            }),
        ];
    }

    private function isOpenNow($schedule): bool
    {
        $now = now()->toTimeString();
        return $schedule->opens_at <= $now && $schedule->closes_at >= $now;
    }
}
```

#### `app/Http/Controllers/TruckController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTruckRequest;
use App\Models\FoodTruck;
use App\Models\Location;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TruckController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $date = $request->date ? Carbon::parse($request->date) : now();

        $trucks = FoodTruck::with([
            'cuisine:id,name,emoji,slug',
            'locations' => function ($q) use ($request, $date) {
                if ($request->filled('lat') && $request->filled('lng')) {
                    $lat    = (float) $request->lat;
                    $lng    = (float) $request->lng;
                    $radius = (int) ($request->radius ?? 50);
                    // Haversine formula
                    $q->whereRaw(
                        '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) < ?',
                        [$lat, $lng, $lat, $radius]
                    );
                }
                $q->with(['schedules' => fn($s) => $s->openToday($date)]);
            },
        ])
        ->when($request->filled('cuisine'), fn($q) =>
            $q->whereHas('cuisine', fn($c) => $c->where('slug', $request->cuisine))
        )
        ->when($request->boolean('open_now'), fn($q) =>
            $q->whereHas('locations.schedules', fn($s) => $s->openNow())
        )
        ->get()
        ->map(fn($truck) => $this->formatTruck($truck, $date));

        return response()->json(['data' => $trucks]);
    }

    public function show(string $id): JsonResponse
    {
        $truck = FoodTruck::with(['cuisine', 'locations.schedules'])->findOrFail($id);
        return response()->json(['data' => $this->formatTruck($truck, now())]);
    }

    public function create(): Response
    {
        return Inertia::render('Register/Index');
    }

    public function store(StoreTruckRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $photoUrl = $request->file('photo')->store('trucks', 'public');
        }

        $truck = FoodTruck::create([
            'cuisine_id'    => $data['cuisine_id'],
            'name'          => $data['name'],
            'description'   => $data['description'] ?? null,
            'phone'         => $data['phone'] ?? null,
            'instagram_url' => $data['instagram_url'] ?? null,
            'photo_url'     => $photoUrl ? asset('storage/' . $photoUrl) : null,
        ]);

        $location = Location::create([
            'food_truck_id' => $truck->id,
            'address'       => $data['address'],
            'city'          => $data['city'],
            'latitude'      => $data['latitude'],
            'longitude'     => $data['longitude'],
            'place_name'    => $data['place_name'] ?? null,
        ]);

        foreach ($data['days'] as $day) {
            Schedule::create([
                'location_id'  => $location->id,
                'day_of_week'  => $day,
                'opens_at'     => $data['opens_at'],
                'closes_at'    => $data['closes_at'],
                'is_recurring' => $data['is_recurring'] ?? true,
            ]);
        }

        return redirect('/')->with('success', "Votre truck \"{$truck->name}\" a bien été enregistré !");
    }

    private function formatTruck(FoodTruck $truck, $date): array
    {
        return [
            'id'            => $truck->id,
            'name'          => $truck->name,
            'cuisine'       => $truck->cuisine->only('name', 'emoji', 'slug'),
            'photo_url'     => $truck->photo_url,
            'instagram_url' => $truck->instagram_url,
            'phone'         => $truck->phone,
            'locations'     => $truck->locations->map(function ($loc) {
                $schedule = $loc->schedules->first();
                return [
                    'id'              => $loc->id,
                    'address'         => $loc->address,
                    'city'            => $loc->city,
                    'latitude'        => (float) $loc->latitude,
                    'longitude'       => (float) $loc->longitude,
                    'place_name'      => $loc->place_name,
                    'is_open_today'   => $schedule !== null,
                    'is_open_now'     => $schedule && $this->isOpenNow($schedule),
                    'todays_schedule' => $schedule ? [
                        'opens_at'  => $schedule->opens_at,
                        'closes_at' => $schedule->closes_at,
                    ] : null,
                ];
            }),
        ];
    }

    private function isOpenNow($schedule): bool
    {
        $now = now()->toTimeString();
        return $schedule->opens_at <= $now && $schedule->closes_at >= $now;
    }
}
```

#### `app/Http/Controllers/CuisineController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Cuisine;
use Illuminate\Http\JsonResponse;

class CuisineController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Cuisine::select('id', 'name', 'slug', 'emoji')->orderBy('name')->get(),
        ]);
    }
}
```

---

### Form Request

#### `app/Http/Requests/StoreTruckRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTruckRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            // Step 1 — Truck info
            'name'          => ['required', 'string', 'max:255'],
            'cuisine_id'    => ['required', 'string', 'exists:cuisines,id'],
            'description'   => ['nullable', 'string', 'max:1000'],
            'phone'         => ['nullable', 'string', 'max:30'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'photo'         => ['nullable', 'image', 'max:2048'],
            // Step 2 — Location
            'address'       => ['required', 'string', 'max:255'],
            'city'          => ['required', 'string', 'max:100'],
            'latitude'      => ['required', 'numeric', 'between:-90,90'],
            'longitude'     => ['required', 'numeric', 'between:-180,180'],
            'place_name'    => ['nullable', 'string', 'max:255'],
            // Step 3 — Schedule
            'days'          => ['required', 'array', 'min:1'],
            'days.*'        => ['integer', 'between:0,6'],
            'opens_at'      => ['required', 'date_format:H:i'],
            'closes_at'     => ['required', 'date_format:H:i', 'after:opens_at'],
            'is_recurring'  => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'Le nom du food truck est obligatoire.',
            'cuisine_id.required' => 'Sélectionnez un type de cuisine.',
            'cuisine_id.exists'   => 'Le type de cuisine sélectionné est invalide.',
            'latitude.required'   => 'Placez le truck sur la carte.',
            'days.required'       => 'Sélectionnez au moins un jour.',
            'closes_at.after'     => "L'heure de fermeture doit être après l'ouverture.",
        ];
    }
}
```

---

### Routes

#### `routes/web.php`

```php
<?php

use App\Http\Controllers\CuisineController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/enregistrer', [TruckController::class, 'create'])->name('trucks.create');
Route::post('/trucks', [TruckController::class, 'store'])->name('trucks.store');

Route::prefix('api')->group(function () {
    Route::get('/trucks', [TruckController::class, 'index']);
    Route::get('/trucks/{id}', [TruckController::class, 'show']);
    Route::get('/cuisines', [CuisineController::class, 'index']);
});
```

---

### Providers

#### `app/Providers/AppServiceProvider.php` (boot excerpt)

```php
Inertia::share([
    'cuisines' => fn() => Cuisine::select('id', 'name', 'slug', 'emoji')
        ->orderBy('name')
        ->get(),
    'flash' => fn() => [
        'success' => session('success'),
    ],
]);
```

---

## API Reference

### `GET /api/trucks`

Returns all food trucks, with optional filters.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lat` | float | — | Center latitude for distance filter |
| `lng` | float | — | Center longitude for distance filter |
| `radius` | int | 50 | Search radius in km (Haversine formula) |
| `cuisine` | string | — | Cuisine slug (e.g. `burger`) |
| `date` | string | today | Date `Y-m-d` format |
| `open_now` | bool | false | Only return currently open trucks |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Burger Bros",
      "cuisine": { "name": "Burger", "emoji": "🍔", "slug": "burger" },
      "photo_url": "https://...",
      "instagram_url": "@burgerbros",
      "phone": "06 12 34 56 78",
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
            "opens_at": "11:00:00",
            "closes_at": "15:00:00"
          }
        }
      ]
    }
  ]
}
```

### `GET /api/trucks/{id}`

Returns a single truck by UUID.

### `GET /api/cuisines`

Returns all cuisine types ordered by name.

```json
{
  "data": [
    { "id": "uuid", "name": "Asiatique", "slug": "asiatique", "emoji": "🍜" }
  ]
}
```

### `POST /trucks`

Registers a new food truck (multipart/form-data).

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | ✅ | string | max 255 |
| `cuisine_id` | ✅ | uuid | must exist in cuisines |
| `description` | — | string | max 1000 |
| `phone` | — | string | max 30 |
| `instagram_url` | — | string | handle without @ |
| `photo` | — | image | max 2MB |
| `address` | ✅ | string | |
| `city` | ✅ | string | |
| `latitude` | ✅ | float | -90 to 90 |
| `longitude` | ✅ | float | -180 to 180 |
| `place_name` | — | string | |
| `days` | ✅ | int[] | 0=Mon … 6=Sun |
| `opens_at` | ✅ | HH:MM | |
| `closes_at` | ✅ | HH:MM | must be after opens_at |
| `is_recurring` | — | bool | default true |

**On success:** redirects to `/` with a flash `success` message.

---

## Frontend

### Composables

#### `resources/js/Composables/useGeocoding.js`

```js
export function useGeocoding() {
    const search = async (query) => {
        if (!query || query.length < 3) return []
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5&addressdetails=1`,
            { headers: { 'Accept-Language': 'fr' } }
        )
        if (!res.ok) return []
        return res.json()
    }
    return { search }
}
```

#### `resources/js/Composables/useMap.js`

```js
import { onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

export function useMap(containerRef) {
    let map = null
    let clusterGroup = null
    let onTruckClickCallback = null

    const init = () => {
        map = L.map(containerRef.value, {
            center: [46.603354, 1.888334], // center of France
            zoom: 6,
            zoomControl: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            maxZoom: 19,
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)

        clusterGroup = L.markerClusterGroup({
            iconCreateFunction: (cluster) => L.divIcon({
                html: `<div class="truck-cluster">${cluster.getChildCount()}</div>`,
                className: '',
                iconSize: L.point(40, 40),
            }),
            showCoverageOnHover: false,
            maxClusterRadius: 60,
        })

        map.addLayer(clusterGroup)
    }

    const setTrucks = (trucks, onClickFn) => {
        if (!clusterGroup) return
        onTruckClickCallback = onClickFn
        clusterGroup.clearLayers()

        const markers = trucks.flatMap((truck) =>
            truck.locations.map((loc) => {
                const icon = L.divIcon({
                    html: `<div class="truck-marker ${loc.is_open_now ? '' : 'closed'}"><span class="emoji">${truck.cuisine.emoji}</span></div>`,
                    className: '',
                    iconSize: L.point(40, 40),
                    iconAnchor: L.point(20, 40),
                    popupAnchor: L.point(0, -40),
                })
                const marker = L.marker([loc.latitude, loc.longitude], { icon })
                marker.on('click', () => onTruckClickCallback?.(truck, loc))
                return marker
            })
        )

        clusterGroup.addLayers(markers) // addLayers() is faster than individual addLayer()
    }

    const flyTo = (lat, lng, zoom = 14) => {
        map?.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 })
    }

    onUnmounted(() => { map?.remove(); map = null; clusterGroup = null })

    return { init, setTrucks, flyTo }
}
```

#### `resources/js/Composables/useTrucks.js`

```js
import { ref, watch } from 'vue'

export function useTrucks(initialTrucks = []) {
    const trucks = ref(initialTrucks)
    const loading = ref(false)
    const filters = ref({
        cuisine: null,
        openNow: false,
        lat: null,
        lng: null,
    })

    const fetch = async () => {
        loading.value = true
        const params = new URLSearchParams()
        if (filters.value.cuisine) params.set('cuisine', filters.value.cuisine)
        if (filters.value.openNow)  params.set('open_now', '1')
        if (filters.value.lat)      params.set('lat', filters.value.lat)
        if (filters.value.lng)      params.set('lng', filters.value.lng)

        try {
            const res  = await window.fetch(`/api/trucks?${params}`)
            const json = await res.json()
            trucks.value = json.data
        } finally {
            loading.value = false
        }
    }

    watch(filters, fetch, { deep: true })

    return { trucks, loading, filters, fetch }
}
```

---

### UI Components

#### `AppButton.vue`

```vue
<script setup lang="ts">
defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}>()
</script>

<template>
    <button
        :type="type ?? 'button'"
        :disabled="disabled"
        :class="[
            'inline-flex items-center justify-center text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
            variant === 'secondary'
                ? 'border border-warm-200 hover:bg-warm-50 text-warm-900 rounded-md px-5 py-2.5'
                : variant === 'ghost'
                    ? 'text-coral-400 hover:text-coral-600 underline-offset-2 hover:underline'
                    : 'bg-coral-400 hover:bg-coral-600 text-white rounded-md px-5 py-2.5 font-medium',
        ]"
    >
        <slot />
    </button>
</template>
```

#### `AppBadge.vue`

```vue
<script setup lang="ts">
defineProps<{ variant?: 'open' | 'closed' | 'cuisine' }>()
</script>

<template>
    <span :class="[
        'inline-flex items-center rounded-full px-3 py-0.5 text-xs',
        variant === 'open'    ? 'bg-open-50 text-open-600 font-medium' :
        variant === 'cuisine' ? 'bg-coral-50 text-coral-600' :
                                'bg-warm-50 text-warm-500',
    ]">
        <slot />
    </span>
</template>
```

#### `AppInput.vue`

```vue
<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{ modelValue?: string; placeholder?: string; icon?: Component; type?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
    <div class="relative">
        <component :is="icon" v-if="icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-500" />
        <input
            :type="type ?? 'text'"
            :value="modelValue"
            :placeholder="placeholder"
            :class="['w-full border border-warm-200 rounded-md py-2 text-sm bg-white',
                     'focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent',
                     'placeholder:text-warm-500', icon ? 'pl-9 pr-3' : 'px-3']"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </div>
</template>
```

#### `AppCard.vue`

```vue
<template>
    <div class="bg-white border border-warm-200 rounded-lg p-4"><slot /></div>
</template>
```

---

### Map Components

#### `MapView.vue`

```vue
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMap } from '../../Composables/useMap'

const props = defineProps<{ trucks: any[] }>()
const emit  = defineEmits<{ 'truck-selected': [truck: any, location: any] }>()

const mapContainer = ref<HTMLElement | null>(null)
const { init, setTrucks, flyTo } = useMap(mapContainer)

onMounted(() => {
    init()
    setTrucks(props.trucks, (truck, loc) => emit('truck-selected', truck, loc))
})

watch(() => props.trucks, (t) => {
    setTrucks(t, (truck, loc) => emit('truck-selected', truck, loc))
}, { deep: true })

defineExpose({ flyTo })
</script>

<template>
    <div ref="mapContainer" class="w-full h-full" />
</template>
```

#### `TruckPopup.vue`

Displays truck details inside a Leaflet popup (or as a bottom card on mobile).

Fields shown: photo, name, open/closed badge, cuisine badge, today's hours, address, Instagram link, phone link.

#### `SearchBar.vue`

```vue
<!-- Cuisine chips + open-now toggle -->
<template>
    <div class="flex flex-col gap-3">
        <!-- Toggle -->
        <label class="flex items-center gap-2 cursor-pointer">
            <div class="relative w-9 h-5 rounded-full transition-colors duration-150"
                 :class="openNow ? 'bg-open-600' : 'bg-warm-200'"
                 @click="emit('update:openNow', !openNow)">
                <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150"
                     :class="openNow ? 'translate-x-4' : ''" />
            </div>
            <span class="text-sm text-warm-900">Ouvert maintenant</span>
        </label>
        <!-- Cuisine chips -->
        <div class="flex flex-wrap gap-1.5">
            <button class="..." @click="emit('update:selectedCuisine', null)">Tous</button>
            <button v-for="c in cuisines" :key="c.id" class="..."
                    @click="emit('update:selectedCuisine', selectedCuisine === c.slug ? null : c.slug)">
                {{ c.emoji }} {{ c.name }}
            </button>
        </div>
    </div>
</template>
```

---

### Form Components

#### `StepIndicator.vue`

Three-step progress bar with `done` (✓, green), `active` (coral), `future` (gray) states and connecting lines.

#### `Step1Info.vue`

Fields: truck name*, cuisine chips*, description textarea, photo file upload, phone, Instagram handle.

#### `Step2Location.vue`

- Address search input with Nominatim autocomplete (debounced 350ms)
- Mini Leaflet map: click to place a marker, or auto-place from address suggestion
- Lat/Lng readonly display
- Optional place name

#### `Step3Schedule.vue`

- Day-of-week chips: Mon–Sun, multi-select (0=Mon … 6=Sun)
- `opens_at` / `closes_at` time inputs
- Recurring vs. one-off toggle

---

### Pages & Layout

#### `AppLayout.vue`

Fixed 56px navbar with logo link (`/`) and "Mon truck" CTA (`/enregistrer`).

#### `Home.vue` — Map Page

```
Desktop layout:
┌──────────┬──────────────────────────────────┐
│  Panel   │                                  │
│  (288px) │          Leaflet Map             │
│ Filters  │                                  │
│ Truck    │                                  │
│ List     │                                  │
└──────────┴──────────────────────────────────┘

Mobile layout:
┌─────────────────────────────────────────────┐
│                Leaflet Map                  │
│                (full screen)                │
├─────────────────────────────────────────────┤
│    Bottom Sheet (45vh, scrollable)          │
│    Filters + Truck List                     │
└─────────────────────────────────────────────┘
```

- `initialTrucks` (open today) passed from server via Inertia props
- `useTrucks` composable re-fetches on filter change
- Clicking a card flies the map to that location
- Flash success message on return from registration

#### `Register/Index.vue` — Wizard

```
Step 1: Mon truck    Step 2: Emplacement    Step 3: Horaires
[  ●  ]────────[  ○  ]────────[  ○  ]
```

Uses `useForm` from Inertia (single form state across 3 steps). Submits as `multipart/form-data` to `POST /trucks`.

---

### CSS

#### `resources/css/app.css` (full)

```css
@import 'tailwindcss';
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

@theme {
    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

    /* Coral */
    --color-coral-50:  #FAECE7;
    --color-coral-100: #F5C4B3;
    --color-coral-400: #D85A30;
    --color-coral-600: #993C1D;

    /* Warm gray */
    --color-warm-50:  #F1EFE8;
    --color-warm-200: #D3D1C7;
    --color-warm-500: #888780;
    --color-warm-900: #2C2C2A;

    /* Semantic */
    --color-open-50:  #EAF3DE;
    --color-open-300: #A8CC78;
    --color-open-600: #639922;

    /* Radius */
    --radius-sm:   6px;
    --radius-md:   8px;
    --radius-lg:   12px;
    --radius-pill: 9999px;
}

.truck-marker {
    width: 40px; height: 40px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: #D85A30;
    border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
}
.truck-marker.closed { background: #888780; opacity: .65; }
.truck-marker .emoji { transform: rotate(45deg); font-size: 16px; line-height: 1; }

.truck-cluster {
    width: 40px; height: 40px;
    background: #D85A30;
    border: 3px solid rgba(216,90,48,.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 13px; font-weight: 500;
}

.leaflet-popup-content-wrapper {
    border-radius: 12px !important;
    border: 0.5px solid #D3D1C7 !important;
    box-shadow: none !important;
    padding: 0 !important;
}
.leaflet-popup-content { margin: 0 !important; width: 220px !important; }
.leaflet-popup-tip { background: white !important; }
```

---

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ / npm
- MySQL 8

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/<your-github-username>/truckmap.git
cd truckmap

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
npm install

# 4. Environment
cp .env.example .env
php artisan key:generate
```

### Environment Configuration

Edit `.env`:

```env
APP_NAME=TruckMap
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=sync
```

### Database Setup

```bash
# Create the database (in MySQL)
CREATE DATABASE truckmap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run migrations + seed cuisine types
php artisan migrate --seed
```

### Running Locally

```bash
# Terminal 1 — Laravel dev server
php artisan serve

# Terminal 2 — Vite dev server
npm run dev
```

Open [http://localhost:8000](http://localhost:8000).

### Useful Commands

```bash
# Reset DB and re-seed
php artisan migrate:fresh --seed

# Build for production
npm run build

# Clear config cache (after .env change)
php artisan config:clear

# List all routes
php artisan route:list
```

### Storage (photo uploads)

```bash
php artisan storage:link
```

---

## Project Docs

The `docs/` folder follows this structure:

```
docs/
├── base/                   ← immutable project references
│   ├── ARCHITECTURE.md     ← naming conventions, code patterns
│   ├── CAHIER_DES_CHARGES.md ← full V1 specs (French)
│   └── DESIGN_SYSTEM.md    ← design tokens and component specs
├── todo/                   ← current backlog items
│   └── backlog.md
├── sprints/                ← completed sprint logs (delete when shipped)
│   └── sprint-1-v1-beta.md
└── features/               ← feature specs (delete when shipped)
    ├── feature-map-view.md
    └── feature-register-wizard.md
```

> **Convention:** Once a sprint or feature is fully shipped and stable, delete its file. The git history is the archive.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

MIT © [Your Name](https://github.com/<your-github-username>)
