# Sprint 6 — Auth & Admin Panel

**Period:** 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Authentification Laravel native + panel admin pour gérer ses trucks (CRUD).

---

## Delivered

### Auth

| Task | File(s) | Status |
|------|---------|--------|
| Migration `user_id` nullable sur `food_trucks` (nullOnDelete) | `database/migrations/2024_01_01_000014_add_user_id_to_food_trucks_table.php` | ✅ |
| `FoodTruck::user()` belongsTo + `user_id` dans fillable | `app/Models/FoodTruck.php` | ✅ |
| `User::trucks()` hasMany | `app/Models/User.php` | ✅ |
| `Inertia::share('auth')` — user id + name (null si guest) | `app/Providers/AppServiceProvider.php` | ✅ |
| Routes guest (`/connexion`, `/inscription`) + logout middleware auth | `routes/web.php` | ✅ |
| `/enregistrer` + `/trucks` protégés par middleware `auth` | `routes/web.php` | ✅ |
| `AuthController` : showLogin, login, showRegister, register, logout | `app/Http/Controllers/AuthController.php` | ✅ |
| `Auth/Login.vue` — email + password + remember | `resources/js/pages/Auth/Login.vue` | ✅ |
| `Auth/Register.vue` — name + email + password + confirmation | `resources/js/pages/Auth/Register.vue` | ✅ |
| `AppLayout.vue` — navbar auth-aware : Mon espace / Connexion / Déconnexion | `resources/js/Layouts/AppLayout.vue` | ✅ |

### Admin Panel

| Task | File(s) | Status |
|------|---------|--------|
| Routes `/mon-truck/*` — middleware auth, prefix admin | `routes/web.php` | ✅ |
| `TruckAdminController` : index, edit, update (PUT), destroy (DELETE) | `app/Http/Controllers/TruckAdminController.php` | ✅ |
| `UpdateTruckRequest` — mêmes règles que StoreTruckRequest, photo nullable | `app/Http/Requests/UpdateTruckRequest.php` | ✅ |
| `Admin/Index.vue` — liste trucks avec photo/statut, boutons modifier/supprimer | `resources/js/pages/Admin/Index.vue` | ✅ |
| `Admin/Edit.vue` — form édition (3 sections : Step1 + Step2 + Step3) | `resources/js/pages/Admin/Edit.vue` | ✅ |
| `TruckController::store()` — set `user_id = auth()->id()` | `app/Http/Controllers/TruckController.php` | ✅ |

---

## Routes

| Méthode | URL | Nom | Middleware |
|---------|-----|-----|-----------|
| GET | `/connexion` | `login` | guest |
| POST | `/connexion` | — | guest |
| GET | `/inscription` | `register` | guest |
| POST | `/inscription` | — | guest |
| POST | `/deconnexion` | `logout` | auth |
| GET | `/enregistrer` | `trucks.create` | auth |
| POST | `/trucks` | `trucks.store` | auth |
| GET | `/mon-truck` | `admin.index` | auth |
| GET | `/mon-truck/{truck}/editer` | `admin.edit` | auth |
| PUT | `/mon-truck/{truck}` | `admin.update` | auth |
| DELETE | `/mon-truck/{truck}` | `admin.destroy` | auth |

---

## Key Decisions

- **Auth native Laravel** (pas Breeze) — évite les conflits de fichiers. Sessions standard, Hash::make, Auth::attempt.
- **`user_id` nullable + nullOnDelete** : les trucks seedés/existants sans user restent visibles sur la carte. Un truck sans owner ne peut simplement pas être édité depuis l'admin.
- **Ownership check via `abort_if`** : `abort_if($truck->user_id !== Auth::id(), 403)` — simple, sans Policy dédiée pour V1.
- **Update = delete + recreate location/schedules** : plus simple qu'un diff de schedules. Les cascades DB font le ménage automatiquement.
- **Edit page** : les 3 Step components réutilisés en sections (sans stepper). Step2Location restaure le pin automatiquement si lat/lng pré-remplis.
- **Navbar** : CTA `+ Mon truck` redirige vers `/inscription` si non connecté, `/enregistrer` si connecté. "Mon espace" → `/mon-truck`.
