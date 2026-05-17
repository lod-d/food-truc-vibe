# Sprint 4 — Polish

**Period:** 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Compléter les features registre + liste — pagination, email de confirmation, détection de doublons.

---

## Delivered

### Feature : Pagination liste trucks

| Task | File(s) | Status |
|------|---------|--------|
| `->paginate(20)` dans `TruckController::index()`, shape `{ data, current_page, last_page, total }` | `app/Http/Controllers/TruckController.php` | ✅ |
| `buildParams(page)` + `loadMore()` + `hasMore` dans `useTrucks` | `resources/js/Composables/useTrucks.js` | ✅ |
| Bouton "Charger plus" dans le panel desktop | `resources/js/pages/Home.vue` | ✅ |

### Feature : Email de confirmation

| Task | File(s) | Status |
|------|---------|--------|
| Champ `email` (nullable) dans `StoreTruckRequest` | `app/Http/Requests/StoreTruckRequest.php` | ✅ |
| Champ `email` dans le form `Register/Index.vue` | `resources/js/pages/Register/Index.vue` | ✅ |
| Input email dans Step 1 | `resources/js/Components/Forms/Step1Info.vue` | ✅ |
| `email` passé à `FoodTruck::create()` | `app/Http/Controllers/TruckController.php` | ✅ |
| `TruckRegisteredMail` Mailable | `app/Mail/TruckRegisteredMail.php` | ✅ |
| Template email blade | `resources/views/emails/truck-registered.blade.php` | ✅ |
| `Mail::to($truck->email)->send(...)` conditionnel dans `store()` | `app/Http/Controllers/TruckController.php` | ✅ |

### Feature : Détection de doublons

| Task | File(s) | Status |
|------|---------|--------|
| Route `GET /api/trucks/check-name` (avant `{id}`) | `routes/web.php` | ✅ |
| `TruckController::checkName()` — `LOWER(name)` exact match | `app/Http/Controllers/TruckController.php` | ✅ |
| Watch `form.name` debounce 400ms → appel API → warning amber dans Step 1 | `resources/js/Components/Forms/Step1Info.vue` | ✅ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Backlog nettoyé, items livrés dans section Done | `docs/todo/backlog.md` | ✅ |
| feature-register-wizard.md — email + duplicate ✅ | `docs/features/feature-register-wizard.md` | ✅ |
| Sprint log | `docs/sprints/sprint-4-polish.md` | ✅ |

---

## Key Decisions

- **Email optionnel** : pas de `required` — un truck sans email est valide. L'envoi est conditionnel (`if ($truck->email)`).
- **`MAIL_MAILER=log`** en dev : les emails sont écrits dans `storage/logs/laravel.log`, pas envoyés. Changer `.env` pour utiliser SMTP/Mailtrap en prod.
- **Duplicate check — exact match insensible à la casse** : `LOWER(name) = ?`. Assez strict pour éviter les faux positifs (deux trucks "Burger Bros" et "burger bros" sont des doublons, "Burger Bro" ne l'est pas). Le wizard laisse l'utilisateur continuer malgré l'avertissement.
- **`check-name` avant `{id}`** dans les routes API : indispensable sinon Laravel capturerait `check-name` comme un ID de truck.
- **Pagination 20/page** : `->paginate(20)` — `loadMore()` appende les résultats au tableau existant (pas de reset). Les filtres actifs (cuisine, bounds, name…) sont transmis à chaque page.
