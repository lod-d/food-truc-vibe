# TruckMap — Architecture & Conventions

---

## Conventions de nommage

### PHP / Laravel
- Models : `PascalCase` singulier → `FoodTruck`, `Schedule`
- Controllers : `PascalCase` + `Controller` → `TruckController`
- Migrations : snake_case + timestamp auto → `create_food_trucks_table`
- Routes : kebab-case → `/api/trucks`, `/enregistrer`
- Scopes Eloquent : `camelCase` préfixé `scope` → `scopeOpenNow`

### Vue / JS
- Composants : `PascalCase` → `MapView.vue`, `TruckPopup.vue`
- Composables : `camelCase` préfixé `use` → `useMap.js`
- Props : `camelCase` → `:foodTruck`, `:isOpenNow`
- Emits : `kebab-case` → `@truck-selected`, `@step-completed`
- Variables réactives : `camelCase` → `const selectedTruck = ref(null)`

### CSS / Tailwind
- Pas de classes CSS custom sauf pour Leaflet (markers, popups)
- Pas de `@apply` sauf dans le fichier `app.css` pour les markers

---

## Conventions Inertia.js

### Partager des données globales (layouts)

```php
// AppServiceProvider.php → boot()
Inertia::share([
    'cuisines' => fn() => Cuisine::select('id', 'name', 'slug', 'emoji')
                              ->orderBy('name')
                              ->get(),
]);
```

### Passer des props à une page

```php
// HomeController.php
public function index()
{
    return Inertia::render('Home', [
        'initialTrucks' => TruckResource::collection(
            FoodTruck::with(['cuisine', 'locations.schedules'])
                     ->whereHas('locations.schedules', fn($q) => $q->openToday(now()))
                     ->get()
        ),
    ]);
}
```

### Formulaire wizard multi-step (Inertia useForm)

```js
// Register/Index.vue
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  // Step 1
  name: '',
  cuisine_id: '',
  description: '',
  phone: '',
  instagram_url: '',
  photo: null,
  // Step 2
  address: '',
  city: '',
  latitude: null,
  longitude: null,
  place_name: '',
  // Step 3
  days: [],
  opens_at: '',
  closes_at: '',
  is_recurring: true,
})

const submit = () => form.post(route('trucks.store'))
```

---

## API JSON — TruckController

```php
// TruckController.php

public function index(Request $request): JsonResponse
{
    $date = $request->date ? Carbon::parse($request->date) : now();

    $trucks = FoodTruck::with([
        'cuisine',
        'locations' => function ($q) use ($request, $date) {
            if ($request->lat && $request->lng) {
                // Filtre par distance (haversine via raw SQL)
                $lat = (float) $request->lat;
                $lng = (float) $request->lng;
                $radius = (int) ($request->radius ?? 50);
                $q->whereRaw(
                    '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) < ?',
                    [$lat, $lng, $lat, $radius]
                );
            }
            $q->with(['schedules' => fn($s) => $s->openToday($date)]);
        },
    ])
    ->when($request->cuisine, fn($q) =>
        $q->whereHas('cuisine', fn($c) => $c->where('slug', $request->cuisine))
    )
    ->get()
    ->map(function ($truck) use ($date) {
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
                    'id'             => $loc->id,
                    'address'        => $loc->address,
                    'city'           => $loc->city,
                    'latitude'       => (float) $loc->latitude,
                    'longitude'      => (float) $loc->longitude,
                    'place_name'     => $loc->place_name,
                    'is_open_today'  => $schedule !== null,
                    'is_open_now'    => $schedule && $this->isOpenNow($schedule),
                    'todays_schedule' => $schedule ? [
                        'opens_at'  => $schedule->opens_at,
                        'closes_at' => $schedule->closes_at,
                    ] : null,
                ];
            }),
        ];
    });

    return response()->json(['data' => $trucks]);
}

private function isOpenNow(Schedule $schedule): bool
{
    $now = now()->toTimeString();
    return $schedule->opens_at <= $now && $schedule->closes_at >= $now;
}
```

---

## Validation — StoreTruckRequest

```php
// app/Http/Requests/StoreTruckRequest.php

public function rules(): array
{
    return [
        // Step 1
        'name'          => ['required', 'string', 'max:255'],
        'cuisine_id'    => ['required', 'uuid', 'exists:cuisines,id'],
        'description'   => ['nullable', 'string', 'max:1000'],
        'phone'         => ['nullable', 'string', 'max:30'],
        'instagram_url' => ['nullable', 'string', 'max:255'],
        'photo'         => ['nullable', 'image', 'max:2048'],

        // Step 2
        'address'       => ['required', 'string', 'max:255'],
        'city'          => ['required', 'string', 'max:100'],
        'latitude'      => ['required', 'numeric', 'between:-90,90'],
        'longitude'     => ['required', 'numeric', 'between:-180,180'],
        'place_name'    => ['nullable', 'string', 'max:255'],

        // Step 3
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
        'name.required'      => 'Le nom du food truck est obligatoire.',
        'cuisine_id.required'=> 'Sélectionnez un type de cuisine.',
        'latitude.required'  => 'Placez le truck sur la carte.',
        'days.required'      => 'Sélectionnez au moins un jour.',
        'closes_at.after'    => 'La fermeture doit être après l\'ouverture.',
    ];
}
```

---

## Seeder cuisines

```php
// database/seeders/CuisineSeeder.php

public function run(): void
{
    $cuisines = [
        ['name' => 'Burger',       'slug' => 'burger',      'emoji' => '🍔'],
        ['name' => 'Tacos',        'slug' => 'tacos',       'emoji' => '🌮'],
        ['name' => 'Pizza',        'slug' => 'pizza',       'emoji' => '🍕'],
        ['name' => 'Asiatique',    'slug' => 'asiatique',   'emoji' => '🍜'],
        ['name' => 'Sushi',        'slug' => 'sushi',       'emoji' => '🍱'],
        ['name' => 'Kebab',        'slug' => 'kebab',       'emoji' => '🥙'],
        ['name' => 'Végétarien',   'slug' => 'vegetarien',  'emoji' => '🥗'],
        ['name' => 'BBQ',          'slug' => 'bbq',         'emoji' => '🥩'],
        ['name' => 'Desserts',     'slug' => 'desserts',    'emoji' => '🧁'],
        ['name' => 'Street food',  'slug' => 'street-food', 'emoji' => '🥡'],
    ];

    foreach ($cuisines as $cuisine) {
        Cuisine::create($cuisine);
    }
}
```

---

## Variables d'environnement

```env
APP_NAME=TruckMap
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=truckmap
DB_USERNAME=root
DB_PASSWORD=

# Sessions
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Queue (optionnel V1 : sync)
QUEUE_CONNECTION=sync
```

---

## Notes importantes pour Claude Code

- Utiliser **Inertia.js** pour toute navigation — pas d'axios séparé pour les pages
- L'endpoint `/api/trucks` utilise `response()->json()` directement, pas de Resource pour garder le contrôle du format
- **Ne pas** utiliser `uuid` comme type de clé primaire dans les migrations sans ajouter `$table->uuid('id')->primary()` + `protected $keyType = 'string'` + `public $incrementing = false` dans le model
- Leaflet doit être importé **uniquement côté client** (pas de SSR) — utiliser `onMounted` dans Vue
- La méthode `clearLayers()` + `addLayers()` de markercluster est obligatoire pour les performances (pas `removeLayer` en boucle)
- Les tiles CartoDB Positron sont gratuites sans clé pour un usage raisonnable (< 75k tiles/jour)
