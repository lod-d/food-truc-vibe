# Sprint 3 — Finition

**Period:** 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Compléter l'expérience carte — recherche par nom, popup desktop, filtre par zone visible.

---

## Delivered

### Feature : Recherche de truck par nom

| Task | File(s) | Status |
|------|---------|--------|
| Filtre `name` dans `useTrucks` + URLSearchParams | `resources/js/Composables/useTrucks.js` | ✅ |
| Filtre `name` LIKE dans `TruckController::index()` | `app/Http/Controllers/TruckController.php` | ✅ |
| Input recherche debounce 300ms — panel desktop + bottom sheet mobile | `resources/js/pages/Home.vue` | ✅ |

### Feature : Popup Leaflet desktop

| Task | File(s) | Status |
|------|---------|--------|
| `mountPopup()` via `createApp(TruckPopup)` — réutilise le composant existant | `resources/js/Composables/useMap.js` | ✅ |
| `unmountPopups()` au `clearLayers()` et `onUnmounted` | `resources/js/Composables/useMap.js` | ✅ |
| CSS `.truck-leaflet-popup` — width 260px, padding 0 | `resources/css/app.css` | ✅ |

### Feature : Filtre par zone visible (bounds)

| Task | File(s) | Status |
|------|---------|--------|
| `map.on('moveend')` → callback `onBoundsChange` (désactivé si zoom < 10) | `resources/js/Composables/useMap.js` | ✅ |
| `init(onBoundsChange)` — signature mise à jour | `resources/js/Composables/useMap.js` | ✅ |
| Émission `@bounds-changed` | `resources/js/Components/Map/MapView.vue` | ✅ |
| `filters.bounds` mis à jour via `@bounds-changed` | `resources/js/pages/Home.vue` | ✅ |
| Filtre `min_lat/max_lat/min_lng/max_lng` dans `useTrucks` | `resources/js/Composables/useTrucks.js` | ✅ |
| `whereBetween latitude/longitude` dans `TruckController::index()` | `app/Http/Controllers/TruckController.php` | ✅ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Mise à jour filtres + popup + future improvements | `docs/features/feature-map-view.md` | ✅ |
| Items livrés cochés + section Done | `docs/todo/backlog.md` | ✅ |
| Sprint log | `docs/sprints/sprint-3-finition.md` | ✅ |

---

## Key Decisions

- **`createApp` dans useMap** : montage d'un vrai composant Vue dans le popup Leaflet — pas de duplication de template, TruckPopup.vue reste la source unique.
- **Bounds désactivé sous zoom 10** : évite un fetch "toute la France" au chargement initial (zoom 6). Le filtre s'active uniquement quand l'utilisateur zoome sur une zone précise.
- **Debounce 300ms manuel** (setTimeout) pour la recherche par nom — pas de dépendance VueUse ajoutée.
- **Cleanup des popupApps** : tableau `popupApps[]` avec `unmount()` systématique au `clearLayers()` — évite les fuites mémoire sur les re-renders.
