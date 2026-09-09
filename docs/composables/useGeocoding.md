# useGeocoding — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Composables/useGeocoding.js`](../../resources/js/Composables/useGeocoding.js)

---

## Rôle

Encapsule les appels à l'API Nominatim (OpenStreetMap) pour la recherche d'adresses et de villes, limité à la France.

---

## API publique

| Fonction | Signature | Description |
|---|---|---|
| `search` | `(query: string) => Promise<Result[]>` | Recherche géographique |

---

## Utilisation

```ts
import { useGeocoding } from '@/Composables/useGeocoding'

const { search } = useGeocoding()

const results = await search('Rennes')
// [
//   { display_name: 'Rennes, Ille-et-Vilaine, Bretagne, France', lat: '48.1173', lon: '-1.6778', address: {...} }
// ]
```

---

## Contraintes Nominatim

| Règle | Valeur |
|---|---|
| Minimum de caractères | 3 |
| Debounce | 350ms |
| Rate limit | **max 1 req/sec** (règle Nominatim) |
| Pays | France uniquement (`countrycodes=fr`) |
| Langue des résultats | Français (`Accept-Language: fr`) |
| Max résultats | 5 |

> **Important.** Ne pas dépasser 1 req/sec — risque de ban IP par Nominatim. Le debounce de 350ms protège contre la frappe rapide mais l'utilisateur peut toujours déclencher des requêtes fréquentes si les suggestions arrivent vite.

---

## Format de réponse

```ts
interface GeocodingResult {
    display_name: string   // "Paris, Île-de-France, France"
    lat: string            // "48.8566"
    lon: string            // "2.3522"
    address: {
        city?: string
        town?: string
        village?: string
        state?: string
        country: string
    }
}
```

---

## Utilisation dans le wizard (Step 2)

Dans [`Step2Location.vue`](../../resources/js/Components/Forms/Step2Location.vue), `useGeocoding` alimente les suggestions de l'input d'adresse. Le résultat sélectionné remplit `form.latitude`, `form.longitude`, `form.address`, `form.city`.
