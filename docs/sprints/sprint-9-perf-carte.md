# Sprint 9 — Perfs carte & SSR fantôme

**Period:** 2026-09-20
**Status:** ✅ Shipped (code)
**Goal:** Supprimer les trois causes de lenteur identifiées à la revue de la branche `feat/demo-environment` : un SSR activé que personne ne fait tourner, un appel API par déplacement de carte, et une app Vue montée par marqueur.

---

## Contexte

Revue déclenchée par deux symptômes remontés à l'usage : « la carte me demande une clé API » et « l'app est très lente ».

La clé API **n'est pas un bug de cette branche** : le commit `faa4a97` a remplacé CARTO par Esri World Light Gray, et les deux seuls `tileLayer` du repo répondent en HTTP 200 sans clé, CORS ouvert. Le message ne peut venir que d'un artefact antérieur au 9 septembre — le bundle `bootstrap/ssr/ssr.js` du 11 juillet, qui contenait encore `basemaps.cartocdn.com`, ou la démo publique, dont le déploiement Dokploy est encore ⏳ au Sprint 8.

---

## Décisions

- **SSR coupé plutôt que branché.** Le commit `c1467d6` a rendu Leaflet compatible du rendu serveur, mais rien dans la chaîne de déploiement ne construit ni ne démarre le bundle. Le faire tourner vraiment demanderait `nodejs` dans l'image PHP, un `build:ssr` au Dockerfile et un program supervisord de plus. Reporté : le travail de `c1467d6` reste valable le jour où on rallume.
- **Debounce à 300 ms**, aligné sur les debounces déjà en place côté recherche (`Home.vue` : 300 ms nom, `useGeocoding` : 350 ms).
- **Popup paresseuse plutôt que HTML brut** : on garde `TruckPopup.vue` et sa réactivité, on décale seulement son coût au premier clic.

---

## Delivered

### (a) SSR fantôme

| Task | File(s) | Status |
|------|---------|--------|
| `ssr.enabled` passé à `false` — chaque rendu tentait un POST vers `127.0.0.1:13714` où rien n'écoute | `config/inertia.php` | ✅ |
| `bootstrap/ssr` ajouté au `.dockerignore` — `COPY . .` embarquait dans l'image un bundle du 11 juillet, jamais reconstruit (le Dockerfile lance `npm run build`, pas `build:ssr`) | `.dockerignore` | ✅ |

### (b) Un appel API par déplacement de carte

| Task | File(s) | Status |
|------|---------|--------|
| `scheduleFetch()` — debounce 300 ms entre `watch(filters)` et `fetch()`. L'appel initial reste immédiat | `resources/js/Composables/useTrucks.ts` | ✅ |
| `AbortController` sur `fetch()` et `loadMore()` : une recherche annule la précédente et la pagination en vol | `resources/js/Composables/useTrucks.ts` | ✅ |
| `loading` / `loadingMore` ne retombent que si le contrôleur qui se termine est encore le courant | `resources/js/Composables/useTrucks.ts` | ✅ |
| `AbortError` ignoré silencieusement (ce n'est pas une erreur à logger) | `resources/js/Composables/useTrucks.ts` | ✅ |
| Garde `typeof window === 'undefined'` — le composable est évalué dans le `setup` de `Home.vue`, donc au rendu serveur si le SSR revient | `resources/js/Composables/useTrucks.ts` | ✅ |
| `onScopeDispose` : timer vidé, requêtes restantes annulées | `resources/js/Composables/useTrucks.ts` | ✅ |

### (c) Une app Vue par marqueur

| Task | File(s) | Status |
|------|---------|--------|
| `bindPopup()` reçoit une fonction mémoïsée : `TruckPopup.vue` n'est monté qu'à la première ouverture | `resources/js/Composables/useMap.ts` | ✅ |

### Docs

| Task | File(s) | Status |
|------|---------|--------|
| Sections Debounce / Annulation / Rendu serveur | `docs/composables/useTrucks.md` | ✅ |
| Popup paresseuse dans `setTrucks` | `docs/composables/useMap.md` | ✅ |
| Descriptions composables réalignées | `CLAUDE.md` | ✅ |
| Reste de la revue versé au backlog | `docs/todo/backlog.md` | ✅ |

---

## Key Decisions

- **Le debounce ne remplace pas la comparaison de bounds.** `docs/composables/useMap.md` prétendait que `onBoundsChange` ne partait que si « les bounds ont réellement changé (comparaison par valeur) » — cette comparaison n'existe pas dans le code. Le debounce réduit la casse ; le garde par valeur reste à écrire (backlog).
- **`throttle:60,1` sur `/api/trucks` n'a pas bougé.** Avec un appel par pan, on le tapait en navigation normale et le `catch` se contentait d'un `console.error` — les marqueurs disparaissaient sans explication. Le debounce traite la cause ; l'affichage d'une erreur utilisateur reste à faire (backlog).

---

## Verification

```bash
npm run types:check     # ✅
npm run lint:check      # ✅
npx prettier --check resources/js/Composables/useMap.ts resources/js/Composables/useTrucks.ts   # ✅
php artisan test        # ✅ 2/2
```

Non vérifié à l'exécution : MySQL n'écoutait pas sur `127.0.0.1:3306` et aucun conteneur ne tournait au moment de la revue. À valider au navigateur :

- pan continu sur la carte → **un seul** `GET /api/trucks` en fin de geste (onglet Réseau)
- pan rapide → les requêtes précédentes apparaissent en `(canceled)`, jamais de 429
- ouverture d'une popup → contenu identique à avant, apparition sans délai perceptible au 2ᵉ clic

---

## Out of scope

- Index manquants sur `locations.latitude/longitude` et `schedules.day_of_week` — backlog
- `paginate(20)` sur une carte : la carte plafonne à 20 trucks quel que soit le viewport — backlog
- Nominatim → BAN pour la recherche de ville — backlog
- `SESSION_DRIVER` / `CACHE_STORE` en base sur la démo — backlog
- `photo_url` stocké en URL absolue via `asset()` — backlog
