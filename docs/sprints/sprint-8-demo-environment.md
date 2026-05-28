# Sprint 8 — Environnement de démo

**Period:** 2026-05-28
**Status:** ✅ Shipped (code) — ⏳ Déploiement Dokploy à brancher
**Goal:** Brancher une démo publique de TruckMap avec credentials simples, données pré-peuplées, reset automatique et bannière visuelle. Objectif : pouvoir présenter le produit en 30 secondes sans setup.

---

## Décisions

- **Hébergement** : Dokploy (même infra que la prod sur `main`). Nouvelle app Dokploy pointant sur la branche `demo`.
- **Domaine** : `demo-truck.deladev.fr` — DNS configuré manuellement.
- **Reset cadence** : quotidien à 04:00 Europe/Paris.
- **Volume trucks démo** : 10 trucks ownés par `demo@truckmap.fr`.
- **`APP_ENV=demo`** comme flag unique pour : seeder démo, banner, scheduler, mail log.

---

## Delivered

### Seeder de démo

| Task | File(s) | Status |
|------|---------|--------|
| `DemoSeeder` — crée `demo@truckmap.fr` / `demo` (mail vérifié) + 10 trucks ownés sur 10 grandes villes FR | `database/seeders/DemoSeeder.php` | ✅ |
| `DatabaseSeeder` : `FoodTruckSeeder` étendu à `env(['local','demo'])` + appel `DemoSeeder` si `env=demo` | `database/seeders/DatabaseSeeder.php` | ✅ |
| Vérifié : `APP_ENV=demo migrate:fresh --seed` → 42 users, 310 trucks, demo user a 10 trucks | — | ✅ |

### Bannière démo + login

| Task | File(s) | Status |
|------|---------|--------|
| `Inertia::share('isDemo')` lit `app()->environment('demo')` | `app/Providers/AppServiceProvider.php` | ✅ |
| `DemoBanner.vue` — bandeau coral sticky sous la navbar, dismiss-able via `sessionStorage` | `resources/js/Components/DemoBanner.vue` | ✅ |
| Intégration `AppLayout.vue` — visible si `isDemo`, offset top du main ajusté (`pt-22`) | `resources/js/Layouts/AppLayout.vue` | ✅ |
| Page `/connexion` — encart avec credentials + bouton "Pré-remplir le formulaire" | `resources/js/pages/Auth/Login.vue` | ✅ |

### Reset automatique

| Task | File(s) | Status |
|------|---------|--------|
| Commande `php artisan demo:reset` — wrap `migrate:fresh --seed --force`, bloquée hors `APP_ENV=demo` | `app/Console/Commands/DemoReset.php` | ✅ |
| Scheduler quotidien à 04:00 Europe/Paris, guard `app()->environment('demo')`, `withoutOverlapping` | `routes/console.php` | ✅ |
| Cron système documenté dans `DEPLOY.md` (`* * * * * cd /var/www && php artisan schedule:run`) | `DEPLOY.md` | ✅ |

### Hardening démo

| Task | File(s) | Status |
|------|---------|--------|
| `.env.demo.example` — `APP_ENV=demo`, `APP_DEBUG=false`, `LOG_LEVEL=warning`, `MAIL_MAILER=log`, `APP_URL=https://demo-truck.deladev.fr` | `.env.demo.example` | ✅ |
| Rate-limit `/inscription` et `/connexion` déjà actif (`throttle:10,1`) — aucun ajustement nécessaire | `routes/web.php` | ✅ |

### Déploiement

| Task | File(s) | Status |
|------|---------|--------|
| Branche `demo` long-lived à créer après merge de cette PR sur `main` (jamais mergée vers `main`) | git | ⏳ |
| Nouvelle app Dokploy pointant sur branche `demo`, env vars de `.env.demo.example` | Dokploy | ⏳ |
| DNS `demo-truck.deladev.fr` → IP serveur démo | DNS | ⏳ |
| Crontab serveur : `* * * * * cd /var/www/truckmap-demo && php artisan schedule:run >> /dev/null 2>&1` | Serveur | ⏳ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Section "Environnement de démo" dans `DEPLOY.md` | `DEPLOY.md` | ✅ |
| Correction de la section "Comportement carte au démarrage" (obsolète depuis Sprint 7) | `DEPLOY.md` | ✅ |
| Sprint log | `docs/sprints/sprint-8-demo-environment.md` | ✅ |
| Entry backlog | `docs/todo/backlog.md` | ✅ |

---

## Key Decisions

- **Pas de réservation de slot** pour la démo : si deux visiteurs y sont en même temps, ils partagent les données. Le reset nettoie tout chaque nuit, l'expérience reste authentique sans complexité de gestion de concurrence.
- **Pré-remplissage en 1 clic** sur `/connexion` plutôt que d'auto-loguer le visiteur : on veut montrer le flow d'authentification, pas le contourner.
- **`MAIL_MAILER=log`** suffit pour neutraliser les envois — pas besoin de patcher le code. Tous les `TruckRegisteredMail` finissent dans `storage/logs/laravel.log`.
- **`withoutOverlapping`** sur le scheduler : si un reset prend > 1 min (peu probable), on évite de lancer le suivant en parallèle.

---

## Verification

```bash
# Simuler l'env démo en local
APP_ENV=demo php artisan migrate:fresh --seed --force

# Vérifier counts
php artisan tinker --execute="
echo \App\Models\User::where('email','demo@truckmap.fr')->first()->trucks()->count().PHP_EOL;
echo \App\Models\FoodTruck::count().PHP_EOL;
"
# → 10
# → 310

# Vérifier guard reset
php artisan demo:reset                    # bloqué (APP_ENV=local)
APP_ENV=demo php artisan demo:reset       # OK

# Tests / lint
php artisan test          # ✅ 2/2
npm run types:check       # ✅
npm run lint              # ✅
```

UX démo (à valider visuellement après build) :

- Bandeau coral en haut sur toutes les pages, dismiss persisté sur la session
- Page `/connexion` affiche le compte démo + bouton de pré-remplissage
- Login avec `demo@truckmap.fr` / `demo` → arrive sur `/mon-truck` avec 10 trucks listés

---

## Out of scope

- **Auth GitHub/Google** pour la démo
- **Backup pré-reset** — perte intégrale assumée chaque nuit
- **Sprint B (mobile)** et **Sprint C (UX polish)** de l'audit Home — restent en backlog
