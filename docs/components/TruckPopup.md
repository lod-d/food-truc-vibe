# TruckPopup — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Components/Map/TruckPopup.vue`](../../resources/js/Components/Map/TruckPopup.vue)

---

## Rôle

Contenu de la popup Leaflet affichée au clic sur un marker. Monté via `createApp` dans `useMap.ts` (pas via le template Vue standard).

---

## Props

| Prop | Type | Nullable | Description |
|---|---|---|---|
| `truck` | `Truck` | Non | Données du food truck |
| `location` | `Location` | Non | Localisation spécifique |

---

## Affichage du statut

```
is_open_now    → badge vert "● Ouvert"
is_open_today  → badge gris "Fermé" + horaires du jour
(aucun)        → aucun badge
```

---

## Montage dans Leaflet

```ts
// useMap.ts
const app = createApp(TruckPopup, { truck, location })
app.mount(container)
popupApps.push(app)  // suivi pour cleanup

marker.bindPopup(container)
```

**Cleanup :** `onUnmounted` dans `useMap` appelle `app.unmount()` sur chaque instance pour éviter les fuites mémoire.

---

## Contraintes

- Ce composant **ne doit pas** utiliser `inject` ou accéder au store global — il est monté hors de l'arbre Vue principal.
- Le `createApp` crée un contexte Vue isolé : pas d'accès à Inertia, pas de router.
