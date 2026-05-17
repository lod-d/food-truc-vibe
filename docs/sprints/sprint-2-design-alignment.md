# Sprint 2 — Design Alignment

**Period:** 2026-05-17  
**Status:** ✅ Shipped  
**Goal:** Aligner l'UI sur `docs/base/TRUCKMAP_VISUALS.pdf` — layout, tokens, et géolocalisation.

---

## Delivered

### Feature : Bouton géolocalisation

| Task | File(s) | Status |
|------|---------|--------|
| `showUserLocation(lat, lng)` dans useMap | `resources/js/Composables/useMap.js` | ✅ |
| Expose `showUserLocation` via MapView | `resources/js/Components/Map/MapView.vue` | ✅ |
| Bouton "Me localiser" overlay carte + logique geolocation | `resources/js/pages/Home.vue` | ✅ |
| CSS marqueur bleu pulsant `.user-location-marker` | `resources/css/app.css` | ✅ |

### Design Alignment — Tokens

| Task | File(s) | Status |
|------|---------|--------|
| Supprimer `--color-coral-100` du @theme | `resources/css/app.css` | ✅ |
| Supprimer `--color-open-300` du @theme | `resources/css/app.css` | ✅ |
| `hover:file:bg-coral-100` → `coral-50` | `resources/js/Components/Forms/Step1Info.vue` | ✅ |
| `border-open-300` + `bg-open-300` → `open-600` | `resources/js/Components/Forms/StepIndicator.vue` | ✅ |
| `text-warm-800` → `text-warm-900` (bouton géoloc) | `resources/js/pages/Home.vue` | ✅ |
| `border-open-300` flash message → `open-600` | `resources/js/pages/Home.vue` | ✅ |

### Design Alignment — Layout

| Task | File(s) | Status |
|------|---------|--------|
| Panel liste : gauche → **droite** (`border-l`) | `resources/js/pages/Home.vue` | ✅ |
| Panel header : compteur "X trucks trouvés" | `resources/js/pages/Home.vue` | ✅ |
| Toggle "Ouverts aujourd'hui" : panel → overlay carte BL | `resources/js/pages/Home.vue` | ✅ |
| Barre chips cuisine horizontale sous la carte (desktop) | `resources/js/pages/Home.vue` | ✅ |
| SearchBar : suppression toggle, chips cuisine only | `resources/js/Components/Map/SearchBar.vue` | ✅ |
| Navbar : chips emoji cuisine (desktop, via `usePage`) | `resources/js/Layouts/AppLayout.vue` | ✅ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Mise à jour layout + filtres | `docs/features/feature-map-view.md` | ✅ |
| Geolocation ✅ dans backlog | `docs/todo/backlog.md` | ✅ |
| README : tokens, layout, SearchBar, AppLayout | `README.md` | ✅ |
| CLAUDE.md créé | `CLAUDE.md` | ✅ |

---

## Key Decisions

- **SearchBar** ne gère plus le toggle — séparation des responsabilités : chips = SearchBar, toggle = Home.vue (overlay carte desktop / section dédiée mobile).
- **Chips emoji navbar** : visuelles uniquement. Le filtre actif reste piloté par les chips sous la carte. Liaison `provide/inject` possible en sprint 3 si nécessaire.
- **`warm-500`** (#888780) conservé dans le @theme malgré son absence du tableau officiel — utilisé pour le texte muted et le marker fermé, cohérent avec le système visuel.
