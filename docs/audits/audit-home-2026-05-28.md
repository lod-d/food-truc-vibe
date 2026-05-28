# Audit Home Page — 2026-05-28

**Scope :** `resources/js/pages/Home.vue`, composables `useTrucks`/`useMap`, `HomeController`, `TruckController`, comportement mobile.
**Symptômes signalés par le user :**
1. Après géoloc, aucun truck visible tant qu'on n'a pas cliqué "Ouvert maintenant"
2. Mobile non adapté : carte qui saute, bugs, UX cassée
3. Pas de fetch dynamique selon le zoom

---

## Partie 1 — Pourquoi aucun truck après géoloc (root cause)

### Le flux actuel

```
Page chargée  →  HomeController retourne aucune prop  →  Home.vue init trucks=[]
                ↓
User clique "Me localiser"
                ↓
filters.lat/lng = coords  +  filters.bounds = null   (Home.vue:217-219)
flyTo(lat, lng, zoom=13)
                ↓
Leaflet émet 'moveend' (zoom ≥ 10) → onBoundsChanged(bounds)
                ↓
onBoundsChanged : if (filters.lat) return;      ← BLOQUE        [Home.vue:170-176]
                ↓
filters.bounds reste null
MAIS filters.lat a changé → watch déclenche fetch()             [useTrucks.ts:145]
                ↓
GET /api/trucks?lat=…&lng=…&radius=25                            [useTrucks.ts:55-59]
                ↓
TruckController retourne 20 premiers trucks dans le rayon
mais sans filtre temporel sur la truck elle-même.
Locations eager-loaded avec schedules → openToday($date)        [TruckController:48]
```

### Le vrai bug

Côté back, on ne filtre `FoodTruck` par "a au moins une location ouverte aujourd'hui" QUE si `open_now=1` (ligne 57 de `TruckController`). Sans le flag :

- la query principale retourne **20 trucks** quelconques dans le rayon
- pour chacun, on charge `locations.schedules` filtrées `openToday`
- **résultat** : beaucoup de trucks reviennent avec `locations` peuplées mais `schedules` vide, **ou pire** avec aucune location dans la zone (à cause du filtre Haversine dans le closure des locations)
- côté front, ces trucks remontent dans `trucks.value` mais n'ont rien à afficher sur la carte → user voit la carte vide

Cliquer "Ouvert maintenant" ajoute `whereHas('locations.schedules', openNow)` sur la query racine → seuls les trucks réellement ouverts maintenant remontent → ils ont des locations à afficher → markers visibles. D'où l'illusion que "rien ne marche sauf openNow".

### Bug secondaire : fetch ne s'adapte pas au zoom

`onBoundsChanged` rejette les bounds dès que `filters.lat` est défini (Home.vue:170-176). Conséquence : après géoloc, **dézoomer ou panner la carte ne déclenche aucun nouveau fetch**. L'user reste collé aux 20 trucks fetchés au moment de la géoloc, dans un rayon fixe de 25km autour du point initial.

`useMap.ts` n'émet de bounds qu'à `zoom ≥ 10` (cohérent avec CLAUDE.md), mais ça n'est jamais branché parce que le check `if (filters.lat) return` court-circuite tout.

### Bug tertiaire : empty state au premier rendu

`HomeController::index` retourne `Inertia::render('Home')` **sans aucune prop**. `Home.vue` initialise `trucks = []` et n'effectue **aucun fetch initial**. Tant que l'user ne fait pas une action (géoloc, sélection ville, filtre, recherche), la carte est vide.

Le `CLAUDE.md` documente pourtant l'inverse ("HomeController passe les trucks ouverts aujourd'hui via Inertia props"). **Le code a divergé de la doc.**

---

## Partie 2 — Mobile : ce qui casse

### Critique

| # | Problème | Fichier | Effet |
|---|---|---|---|
| M1 | `h-[calc(100vh-56px)]` au lieu de `100dvh` | [Home.vue:380](resources/js/pages/Home.vue#L380) | iOS Safari : la barre d'URL apparaît/disparaît → la hauteur change → carte saute |
| M2 | Pas d'`invalidateSize()` Leaflet après resize du conteneur | [useMap.ts](resources/js/composables/useMap.ts) | Ouverture bottom-sheet / modale filtres → Leaflet ne recalcule pas → tiles décalées, markers mal positionnés |
| M3 | Pas de scroll-lock body quand modale plein écran ouverte | [Home.vue:1138](resources/js/pages/Home.vue#L1138) | Scroll fantôme derrière la modale, body qui glisse |
| M4 | Z-index incohérents : Leaflet 1000, pill 1100, modale 1200, bottom-sheet 40 | Home.vue | Controls Leaflet (loc, zoom) peuvent passer **par-dessus** la bottom-sheet à z-40 |
| M5 | Tap targets sous 44px (X pill `h-7 w-7` = 28px, X geoloc `h-9 w-9` = 36px) | Home.vue:326, 970 | Mistaps fréquents |

### Mineur

- Pas de `safe-area-inset-*` pour les notches iPhone / Dynamic Island
- Pas de gestion du `orientationchange` (rotation peut casser le layout figé)
- Breakpoint `md:` (768px) brutal — pas d'état tablette intermédiaire

---

## Partie 3 — Recommandations priorisées

### Sprint A — Corriger le comportement "no trucks" (priorité 1)

1. **Filtrer la query racine par `hasOpenLocationToday`** dans `TruckController::index` même sans `open_now`
   → ajouter par défaut `whereHas('locations.schedules', openToday(now))`, sauf si une `date` future est passée.
2. **Fetch initial au mount** dans `Home.vue` : déclencher un fetch dès le `onMounted` avec un viewport "France entière" (ou les bounds initiaux de la carte). Plus de page vide.
3. **Refetch au pan/zoom même avec lat défini** : retirer le `if (filters.lat) return` ligne 170, et plutôt synchroniser `filters.bounds` à chaque `moveend`. La géoloc devient juste un `flyTo` + un marker, pas un mode "verrou rayon 25km".
4. **Indicateur de chargement** sur la carte (overlay discret) pendant un fetch déclenché par le pan.

### Sprint B — Mobile stabilité (priorité 2)

5. Remplacer toutes les hauteurs `100vh` par `100dvh` (avec fallback) — [Home.vue:380](resources/js/pages/Home.vue#L380)
6. Appeler `map.invalidateSize()` :
   - quand la bottom-sheet s'ouvre/ferme
   - quand la modale filtres s'ouvre/ferme
   - sur `orientationchange` et `resize` (debounced 150ms)
7. Scroll-lock body quand `showFilterModal || showLocationSheet` → `body.style.overflow = 'hidden'` dans un `watchEffect`
8. Unifier les z-index : créer 4 strates (`map: 0`, `controls: 100`, `sheet: 200`, `modal: 300`, `toast: 400`) dans `app.css` via custom properties
9. Forcer 44×44 sur tous les boutons tactiles (X pill, X sheet)

### Sprint C — UX polish (priorité 3)

10. Refondre l'empty state initial : afficher tous les trucks de France (clusters) au lieu d'un panel "Où cherchez-vous ?". L'user explore visuellement, puis affine.
11. Persister `filters` dans `sessionStorage` pour survivre aux rotations
12. Safe-area iOS (`env(safe-area-inset-*)`) sur les éléments fixed top/bottom

---

## Fichiers à modifier

- [app/Http/Controllers/HomeController.php](app/Http/Controllers/HomeController.php) — passer les trucks initiaux via Inertia
- [app/Http/Controllers/TruckController.php](app/Http/Controllers/TruckController.php) — filtrer par défaut sur trucks ouverts à la date demandée
- [resources/js/pages/Home.vue](resources/js/pages/Home.vue) — onBoundsChanged, géoloc, dvh, scroll lock, z-index, tap targets
- [resources/js/composables/useMap.ts](resources/js/composables/useMap.ts) — `invalidateSize()` sur resize/sheet
- [resources/js/composables/useTrucks.ts](resources/js/composables/useTrucks.ts) — fetch initial sans attendre `hasLocation`
- [resources/css/app.css](resources/css/app.css) — variables z-index, safe-area

---

## Doc à corriger

Le `CLAUDE.md` (section Backend) affirme que `HomeController@index` passe les trucks via Inertia props. **Faux dans le code actuel** — il faut soit corriger la doc, soit réintroduire ce comportement (recommandé via Sprint A.2).
