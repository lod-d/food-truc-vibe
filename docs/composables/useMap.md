# useMap — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Composables/useMap.ts`](../../resources/js/Composables/useMap.ts)

---

## Rôle

Encapsule toute la logique Leaflet. Aucun autre fichier Vue ne doit importer Leaflet directement — tout passe par ce composable.

---

## API publique

| Fonction | Signature | Description |
|---|---|---|
| `init` | `(onBoundsChange?: BoundsCallback) => void` | Initialise la carte dans le `<div id="map">` |
| `setTrucks` | `(trucks: any[], onClickFn: TruckClickCallback) => void` | Remplace tous les markers (clear + add) |
| `flyTo` | `(lat: number, lng: number, zoom?: number) => void` | Anime la vue vers un point |
| `showUserLocation` | `(lat: number, lng: number, accuracy?: number) => void` | Affiche le marker de position utilisateur |
| `removeUserLocation` | `() => void` | Supprime le marker utilisateur |
| `getMap` | `() => L.Map` | Accès direct à l'instance Leaflet |

---

## Initialisation

```ts
import { useMap } from '@/Composables/useMap'

const { init, setTrucks, flyTo, showUserLocation } = useMap()

onMounted(() => {
    init((bounds) => {
        // appelé à chaque fin de déplacement de carte si zoom ≥ 10
        filters.value.bounds = bounds
    })
})
```

**Centre initial :** France entière (`[46.603354, 1.888334]`, zoom 6).
**Tiles :** CartoDB Positron — gratuites, sans clé, max ~75k tiles/jour.

---

## setTrucks

```ts
setTrucks(trucks, (truck) => {
    // callback au clic sur un marker
    selectedTruck.value = truck
    flyTo(truck.locations[0].latitude, truck.locations[0].longitude)
})
```

Internement :
1. `clusterGroup.clearLayers()` — vide les markers existants
2. Crée un `L.divIcon` par location avec classe `truck-marker` (+ `closed` si fermé)
3. Monte un `TruckPopup.vue` via `createApp` dans chaque popup Leaflet
4. `clusterGroup.addLayers([...markers])` — ajout en batch pour les performances

> **Pourquoi `clearLayers` + `addLayers` ?** `removeLayer` en boucle déclenche un re-rendu par marker. Le batch évite les flickers sur de grandes listes.

---

## flyTo

```ts
flyTo(48.8566, 2.3522)       // zoom 14 (défaut)
flyTo(48.8566, 2.3522, 12)   // zoom personnalisé
```

Durée d'animation : 0.6s. Après `flyTo`, les `moveend` sont ignorés pendant 1500ms (`skipMoveEndUntil`) pour éviter un re-fetch immédiat inutile.

---

## onBoundsChange

Appelé sur l'événement `moveend` si :
- Zoom ≥ 10
- `skipMoveEndUntil` est dépassé
- Les bounds ont réellement changé (comparaison par valeur)

```ts
type BoundsCallback = (bounds: {
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
}) => void
```

---

## Cleanup

`onUnmounted` : ferme toutes les popups Vue (`app.unmount()` sur chaque `popupApps[]`), puis `map.remove()`.

---

## Contraintes

- Doit être utilisé **exclusivement dans `onMounted`** — Leaflet ne fonctionne pas en SSR.
- Un seul appel `init()` par composant — appels multiples créent plusieurs instances carte.
- `setTrucks` est coûteux si le tableau dépasse ~500 items — la pagination côté `useTrucks` limite à 20 par page.
