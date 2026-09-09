# useTrucks — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Composables/useTrucks.ts`](../../resources/js/Composables/useTrucks.ts)

---

## Rôle

Gère le fetch réactif vers `/api/trucks`. Toute modification d'un filtre déclenche automatiquement un nouveau fetch.

---

## API publique

| Export | Type | Description |
|---|---|---|
| `trucks` | `Ref<Truck[]>` | Liste courante des trucks |
| `loading` | `Ref<boolean>` | Premier chargement en cours |
| `loadingMore` | `Ref<boolean>` | Chargement page suivante |
| `hasMore` | `Ref<boolean>` | Pages supplémentaires disponibles |
| `noResultsInBounds` | `Ref<boolean>` | Aucun résultat dans le viewport |
| `filters` | `Ref<TruckFilters>` | Objet de filtres réactif |
| `today` | `string` | Date du jour au format `YYYY-MM-DD` |
| `hasLocation` | `ComputedRef<boolean>` | `true` si `lat`/`lng` définis |
| `fetch` | `() => Promise<void>` | Déclenche un fetch (page 1) |
| `loadMore` | `() => Promise<void>` | Charge la page suivante (append) |

---

## Interface TruckFilters

```ts
interface TruckFilters {
    cuisine: string | null      // slug cuisine ou null
    openNow: boolean            // filtre ouvert maintenant
    lat: number | null          // latitude centre
    lng: number | null          // longitude centre
    radius: number              // rayon km (défaut: 25)
    name: string                // recherche par nom (LIKE)
    bounds: Bounds | null       // viewport carte
    date: string | null         // YYYY-MM-DD ou null (= aujourd'hui)
}
```

---

## Utilisation

```ts
import { useTrucks } from '@/Composables/useTrucks'

const { trucks, loading, filters, fetch, loadMore, hasMore, today } = useTrucks()

// Modifier un filtre → fetch automatique (watch deep)
filters.value.cuisine = 'burger'
filters.value.openNow = true

// Changer la localisation
filters.value.lat = 48.8566
filters.value.lng = 2.3522
filters.value.radius = 25

// Charger plus
if (hasMore.value) await loadMore()
```

---

## Réactivité

```ts
watch(filters, fetch, { deep: true })
```

Tout changement dans `filters` (y compris nested comme `bounds`) relance `fetch()` automatiquement. Le fetch repart toujours de la page 1.

---

## Paramètres envoyés à /api/trucks

| Filtre | Paramètre API |
|---|---|
| `filters.cuisine` | `cuisine=burger` |
| `filters.openNow` | `open_now=1` |
| `filters.lat` + `lng` | `lat=48.8566&lng=2.3522` |
| `filters.radius` | `radius=25` |
| `filters.name` | `name=Marcel` |
| `filters.bounds` | `min_lat=...&max_lat=...&min_lng=...&max_lng=...` |
| `filters.date` | `date=2026-07-15` (absent si null = aujourd'hui) |

---

## Cas particulier : `date` vs `openNow`

- `openNow` n'a de sens que pour `date = aujourd'hui`. Le composant Home désactive ce toggle quand une date future est sélectionnée.
- Si `date` est non null (date future), `open_now` n'est pas envoyé.

---

## Pagination

- Chaque page retourne 20 trucks.
- `loadMore()` incrémente `currentPage` et **appende** les résultats (ne remplace pas).
- `fetch()` remet `currentPage = 1` et **remplace** la liste.
- `hasMore = current_page < last_page` (depuis la réponse API).
