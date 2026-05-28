# Sprint 7 — Home : fix "no trucks sans Ouvert maintenant" + refetch au pan/zoom

**Period:** 2026-05-28
**Status:** ✅ Shipped
**Goal:** Suite à l'audit (`docs/audits/audit-home-2026-05-28.md`), corriger les 3 bugs bloquants côté carte d'accueil : empty state au mount, aucun truck après géoloc sans "Ouvert maintenant", pas de refetch dynamique au pan/zoom.

---

## Delivered

### Backend — filtre "ouvert à la date demandée" par défaut

| Task | File(s) | Status |
|------|---------|--------|
| `TruckController::index` filtre la query racine par `whereHas('locations.schedules', openToday($date))` | `app/Http/Controllers/TruckController.php` | ✅ |
| Les trucks renvoyés ont garantie d'avoir une location ouverte à la date demandée → plus de truck "vide" sur la carte | — | ✅ |
| `open_now=1` reste un filtre supplémentaire en plus du filtre par jour | — | ✅ |

### Frontend — pivot vers un filtre bounds-only

| Task | File(s) | Status |
|------|---------|--------|
| Retrait du guard `if (filters.lat) return` dans `onBoundsChanged` | `resources/js/pages/Home.vue` | ✅ |
| `onLocateMe`, `onCitySelect`, `onForgetLocation`, `clearCityFilter` ne touchent plus à `filters.lat/lng/radius` | `resources/js/pages/Home.vue` | ✅ |
| `hasLocation` mis à `true` explicitement à la géoloc et à la sélection de ville (pilote l'UI du side panel) | `resources/js/pages/Home.vue` | ✅ |
| `useTrucks` : watch sur filters déclenche systématiquement `fetch()` (retrait du gating sur `hasLocation`) | `resources/js/composables/useTrucks.ts` | ✅ |
| `useTrucks` : appel `fetch()` initial dans le setup → carte peuplée dès le mount | `resources/js/composables/useTrucks.ts` | ✅ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Audit complet des 3 bugs + plan de correction sprint A/B/C | `docs/audits/audit-home-2026-05-28.md` | ✅ |
| Sprint B (mobile : dvh, invalidateSize, scroll lock, z-index, tap targets) et Sprint C (empty state, sessionStorage, safe-area) listés dans le backlog | `docs/todo/backlog.md` | ✅ |
| Ce sprint log | `docs/sprints/sprint-7-home-fixes.md` | ✅ |

---

## Key Decisions

- **Bounds-only au lieu de lat/lng/radius côté front** — la géoloc et la sélection de ville déclenchent juste un `flyTo` + un marker, le `moveend` Leaflet qui suit émet des bounds → fetch. Plus de double mode (rayon Haversine vs viewport) qui se contredisent.
- **Filtre `openToday` par défaut côté back** — la query racine ne retourne plus que des trucks ayant au moins une location ouverte à la date demandée. Sans ce filtre, le mécanisme d'eager-load filtré faisait remonter des trucks "fantômes" sans schedules à afficher, donnant l'illusion de carte vide.
- **Fetch initial au mount** — le `useTrucks` charge les 20 premiers trucks de France au montage. La carte démarre peuplée (clusters), sans avoir besoin d'une interaction utilisateur préalable.
- **`hasLocation` piloté explicitement côté Home** — au lieu de dépendre d'un side-effect du watch sur `filters.bounds`, on bascule le flag à `true` directement dans `onLocateMe` et `onCitySelect` pour ne pas dépendre de l'ordre des événements Leaflet.
- **Doc `DEPLOY.md` à corriger** — la section "Comportement carte au démarrage" affirme encore "Aucun truck n'est chargé tant que l'utilisateur n'a pas activé la géolocalisation". Plus vrai depuis ce sprint. Mise à jour incluse dans le Sprint 8 (démo).

---

## Verification

```bash
# Tests
php artisan test           # ✅ 2/2
npm run types:check        # ✅
npm run lint               # ✅

# API
php artisan tinker --execute="
\$r = \Illuminate\\Http\\Request::create('/api/trucks', 'GET');
echo (new \\App\\Http\\Controllers\\TruckController())->index(\$r)->getContent();
" | head -c 200
# → total=194 (sur 300 seedés), 20 par page, locations remplies
```

Tests manuels :

- ✅ Ouverture page → clusters affichés sur toute la France
- ✅ Pan/zoom → refetch automatique
- ✅ Géoloc → flyTo + marker user + trucks autour, sans avoir à toggler "Ouvert maintenant"
- ✅ Sélection ville → flyTo + trucks dans la zone
