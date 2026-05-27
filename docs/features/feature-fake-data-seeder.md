# Feature: Fake Data Seeder (dev only)

**Status:** ✅ Shipped
**Scope:** Tooling / DX — env `local` uniquement
**Entrée :** `php artisan migrate:fresh --seed`

---

## Objectif

Peupler la base de dev avec **~300 food trucks** répartis sur toute la France métropolitaine pour pouvoir :

- tester le clustering Leaflet à volume réaliste
- valider les filtres (cuisine, `openNow`, recherche par nom, bounds viewport, date)
- démontrer la V1 sans avoir à créer les trucks à la main

Les trucks générés n'ont **pas de photo** (`photo_url = null`) — pas besoin d'assets dans `storage/app/public`.

---

## Volumes (après `migrate:fresh --seed` en local)

| Table | Count |
|-------|-------|
| `users`         | 41 (1 dev + 40 fake) |
| `food_trucks`   | ~300 (40 users × 6-9) |
| `locations`     | ~300 (1 par truck) |
| `schedules`     | ~1350 (3-6 jours par location) |

---

## Implémentation

### Factories

- **`database/factories/FoodTruckFactory.php`** — `photo_url = null`, nom random (30 noms FR), cuisine random parmi les 10 seedées, `instagram_url` parfois renseigné
- **`database/factories/LocationFactory.php`** — 30 villes FR (Paris, Lyon, Marseille, … Nancy) avec lat/lng réelles + jitter ±0.05° pour éparpiller dans la zone urbaine
- **`database/factories/ScheduleFactory.php`** — `day_of_week` 0-6 (convention projet : 0=Lun), `opens_at` 11h-12h, `closes_at` 14h-22h, `is_recurring = true`

### Seeder

- **`database/seeders/FoodTruckSeeder.php`** — crée 40 users, puis pour chacun 6-9 trucks avec 1 location et 3-6 schedules (jours uniques tirés au sort)
- Branché dans `DatabaseSeeder` dans le bloc `if (app()->environment('local'))`, après `UserSeeder` — **jamais exécuté en prod**

### Models

Ajout du trait `HasFactory` sur `FoodTruck`, `Location`, `Schedule` (requis par `Model::factory()`).

---

## Vérification

```bash
php artisan migrate:fresh --seed
php artisan tinker --execute="echo \App\Models\FoodTruck::count();"  # 300
composer run dev
# → http://localhost:8000 : clusters Leaflet répartis sur la France
```
