# MapView — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Components/Map/MapView.vue`](../../resources/js/Components/Map/MapView.vue)

---

## Rôle

Composant wrapper autour de `useMap`. Expose `flyTo` et `showUserLocation` au parent via `defineExpose` pour que `Home.vue` puisse piloter la carte depuis la sidebar.

---

## Props

| Prop | Type | Description |
|---|---|---|
| `trucks` | `Truck[]` | Liste des trucks à afficher sur la carte |
| `onBoundsChange` | `BoundsCallback?` | Callback déclenché à chaque déplacement (zoom ≥ 10) |

---

## Exposed (defineExpose)

```ts
defineExpose({ flyTo, showUserLocation })
```

Usage depuis le parent :
```ts
const mapViewRef = ref<InstanceType<typeof MapView>>()
mapViewRef.value?.flyTo(48.8566, 2.3522)
mapViewRef.value?.showUserLocation(lat, lng, accuracy)
```

---

## Cycle de vie

| Moment | Action |
|---|---|
| `onMounted` | `useMap().init(onBoundsChange)` |
| Watch `trucks` | `useMap().setTrucks(trucks, onTruckClick)` |
| `onUnmounted` | Cleanup automatique dans `useMap` |

---

## Contraintes

- Leaflet nécessite que `<div id="map">` soit dans le DOM avant `init()` → utiliser `onMounted`, jamais en `setup` direct.
- Ne pas appeler `setTrucks` avant `init` — la référence à `clusterGroup` sera `undefined`.
