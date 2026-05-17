# Sprint 5 — Date Picker & Finitions

**Period:** 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Ajouter le filtre par date sur la carte + documenter storage:link pour la production.

---

## Delivered

### Feature : Date picker carte

| Task | File(s) | Status |
|------|---------|--------|
| Filtre `date` dans `useTrucks` — `?date=YYYY-MM-DD` (null = aujourd'hui) | `resources/js/Composables/useTrucks.js` | ✅ |
| Export `today` (YYYY-MM-DD) depuis `useTrucks` | `resources/js/Composables/useTrucks.js` | ✅ |
| `selectedDate` ref + `isToday` computed dans `Home.vue` | `resources/js/pages/Home.vue` | ✅ |
| Disable `openNow` automatiquement si date ≠ aujourd'hui | `resources/js/pages/Home.vue` | ✅ |
| Input date + bouton "Aujourd'hui" dans le panel header (desktop) | `resources/js/pages/Home.vue` | ✅ |
| Input date + bouton "Aujourd'hui" dans le bottom sheet (mobile) | `resources/js/pages/Home.vue` | ✅ |
| Toggle overlay : opaque + label "Ouverts ce jour-là" si non-today | `resources/js/pages/Home.vue` | ✅ |

### Doc : storage:link production

| Task | File(s) | Status |
|------|---------|--------|
| Explication contextuelle + avertissement prod | `README.md` | ✅ |

### Docs sprint

| Task | File(s) | Status |
|------|---------|--------|
| Date picker ✅ dans feature-map-view.md | `docs/features/feature-map-view.md` | ✅ |
| storage:link + date picker dans backlog Done | `docs/todo/backlog.md` | ✅ |
| Sprint log | `docs/sprints/sprint-5-date-picker.md` | ✅ |

---

## Key Decisions

- **Backend déjà prêt** : `TruckController::index()` gérait `?date=` depuis sprint 1. Zéro changement côté PHP.
- **`date: null` = aujourd'hui** : on n'envoie pas le param si c'est today, pour garder la compatibilité avec le rendu SSR initial (`HomeController` passe déjà `initialTrucks` calés sur today).
- **`min` sur l'input date** : restreint au passé non sélectionnable (pas de sens de chercher des trucks déjà passés).
- **Toggle `openNow` désactivé** visuellement (`opacity-40 cursor-not-allowed`) quand date ≠ today — "open now" n'a de sens que pour la date du jour.
