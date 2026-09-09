# API REST — TruckMap

**Dernière mise à jour :** 2026-07-11
**Branche de référence :** `main`

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [GET /api/trucks](#2-get-apitrucks)
3. [GET /api/trucks/:id](#3-get-apitrucksid)
4. [GET /api/cuisines](#4-get-apicuisines)
5. [Schéma de réponse](#5-schéma-de-réponse)
6. [Codes d'erreur](#6-codes-derreur)
7. [Accès IA / MCP](#7-accès-ia--mcp)

---

## 1. Vue d'ensemble

| Propriété | Valeur |
|---|---|
| Base URL | `https://foodtruck.deladev.fr/api` |
| Format | JSON |
| Authentification | Aucune (lecture publique) |
| Pagination | 20 résultats par page |
| CORS | Non configuré (usage interne) |
| Rate limiting | Throttle standard Laravel (60 req/min par IP) |

> **Note.** Les routes d'écriture (`POST /trucks`, `PUT /mon-truck/:id`, etc.) passent par des pages Inertia protégées par session (`auth` middleware) — elles ne font pas partie de l'API publique.

---

## 2. GET /api/trucks

Liste paginée des food trucks avec leurs localisations et statut d'ouverture.

### Paramètres

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `lat` | float | Non | Latitude du centre de recherche |
| `lng` | float | Non | Longitude du centre de recherche |
| `radius` | integer (km) | Non | Rayon autour de lat/lng. **Défaut : 50** |
| `cuisine` | string | Non | Slug cuisine (`burger`, `tacos`, `pizza`, `asiatique`, `sushi`, `kebab`, `vegetarien`, `bbq`, `desserts`, `street-food`) |
| `name` | string | Non | Recherche partielle sur le nom (LIKE `%name%`) |
| `open_now` | `1` | Non | Filtre sur les trucks ouverts à l'instant |
| `date` | `YYYY-MM-DD` | Non | Trucks ouverts ce jour précis. **Défaut : aujourd'hui** |
| `min_lat` | float | Non | Borne sud du viewport carte |
| `max_lat` | float | Non | Borne nord du viewport carte |
| `min_lng` | float | Non | Borne ouest du viewport carte |
| `max_lng` | float | Non | Borne est du viewport carte |
| `page` | integer | Non | Numéro de page. **Défaut : 1** |

> **Note bounds.** `min_lat`/`max_lat`/`min_lng`/`max_lng` filtrent par viewport carte (zoom ≥ 10 côté client). Combinables avec `lat`/`lng`/`radius`.

### Exemples

```
GET /api/trucks?open_now=1
GET /api/trucks?lat=48.8566&lng=2.3522&radius=25&cuisine=burger
GET /api/trucks?lat=48.1173&lng=-1.6778&radius=100
GET /api/trucks?name=Marcel&page=2
GET /api/trucks?date=2026-07-15&cuisine=sushi
```

### Réponse

```json
{
  "data": [
    {
      "id": "019f4cc0-6d1b-7086-bd2f-9846bb53713b",
      "name": "Le Camion de Marcel",
      "cuisine": {
        "name": "Burger",
        "emoji": "🍔",
        "slug": "burger"
      },
      "photo_url": "https://foodtruck.deladev.fr/storage/photos/xxx.jpg",
      "instagram_url": "https://instagram.com/lecamiondemarcel",
      "phone": "+33 1 23 45 67 89",
      "locations": [
        {
          "id": "019f4cc0-6d1f-71b7-a67a-29f31d4577b9",
          "address": "12 rue de la Paix",
          "city": "Paris",
          "latitude": 48.8566,
          "longitude": 2.3522,
          "place_name": "Marché Saint-Germain",
          "is_open_today": true,
          "is_open_now": false,
          "todays_schedule": {
            "opens_at": "11:00:00",
            "closes_at": "22:00:00"
          }
        }
      ]
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "total": 87
}
```

### Logique d'ouverture

```
is_open_today  → au moins un schedule existe pour ce jour
is_open_now    → is_open_today ET now() entre opens_at et closes_at
todays_schedule → null si pas d'horaire ce jour
```

**Convention `day_of_week` :** `0=Lun`, `1=Mar`, ..., `6=Dim` — **différent de Carbon** (`0=Dim`). La conversion est dans [`Schedule::scopeOpenToday`](../app/Models/Schedule.php).

---

## 3. GET /api/trucks/:id

Détail complet d'un food truck.

### Paramètres

| Paramètre | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant du truck |

### Réponse

Même format qu'un item de `/api/trucks`, mais avec `todays_schedule` calculé sur `now()`.

```
GET /api/trucks/019f4cc0-6d1b-7086-bd2f-9846bb53713b
```

---

## 4. GET /api/cuisines

Liste des 10 types de cuisine disponibles.

### Réponse

```json
[
  { "id": "...", "name": "Burger",     "slug": "burger",      "emoji": "🍔" },
  { "id": "...", "name": "Tacos",      "slug": "tacos",       "emoji": "🌮" },
  { "id": "...", "name": "Pizza",      "slug": "pizza",       "emoji": "🍕" },
  { "id": "...", "name": "Asiatique",  "slug": "asiatique",   "emoji": "🍜" },
  { "id": "...", "name": "Sushi",      "slug": "sushi",       "emoji": "🍱" },
  { "id": "...", "name": "Kebab",      "slug": "kebab",       "emoji": "🥙" },
  { "id": "...", "name": "Végétarien", "slug": "vegetarien",  "emoji": "🥗" },
  { "id": "...", "name": "BBQ",        "slug": "bbq",         "emoji": "🥩" },
  { "id": "...", "name": "Desserts",   "slug": "desserts",    "emoji": "🧁" },
  { "id": "...", "name": "Street food","slug": "street-food", "emoji": "🥡" }
]
```

---

## 5. Schéma de réponse

### Truck

| Champ | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID string | Non | Identifiant unique |
| `name` | string | Non | Nom du truck |
| `cuisine.name` | string | Non | Nom du type de cuisine |
| `cuisine.emoji` | string | Non | Emoji représentatif |
| `cuisine.slug` | string | Non | Slug pour filtrage API |
| `photo_url` | string | Oui | URL absolue de la photo |
| `instagram_url` | string | Oui | URL profil Instagram |
| `phone` | string | Oui | Numéro de téléphone |
| `locations` | array | Non | Tableau de localisations (1 par truck en V1) |

### Location

| Champ | Type | Nullable | Description |
|---|---|---|---|
| `id` | UUID string | Non | Identifiant unique |
| `address` | string | Non | Adresse postale |
| `city` | string | Non | Ville |
| `latitude` | float | Non | Latitude WGS84 (7 décimales) |
| `longitude` | float | Non | Longitude WGS84 (7 décimales) |
| `place_name` | string | Oui | Nom du lieu (marché, événement…) |
| `is_open_today` | boolean | Non | Truck présent ce jour |
| `is_open_now` | boolean | Non | Truck ouvert à cet instant |
| `todays_schedule` | object\|null | Oui | Horaires du jour |

### Schedule (todays_schedule)

| Champ | Type | Description |
|---|---|---|
| `opens_at` | `HH:MM:SS` | Heure d'ouverture |
| `closes_at` | `HH:MM:SS` | Heure de fermeture |

---

## 6. Codes d'erreur

| Code | Cause |
|---|---|
| `404` | Truck non trouvé (`/api/trucks/:id`) |
| `422` | Paramètre invalide (lat non numérique, etc.) |
| `429` | Rate limit dépassé |
| `500` | Erreur serveur |

---

## 7. Accès IA / MCP

Un serveur **MCP (Model Context Protocol)** est disponible pour les assistants IA compatibles (Claude Desktop, Cursor, Windsurf, etc.).

- **Repo :** [github.com/lod-d/foodtruck-finder](https://github.com/lod-d/foodtruck-finder)
- **Tools disponibles :** `get_trucks`, `get_nearby_trucks`, `get_truck`
- **Documentation IA :** [`/llms.txt`](https://foodtruck.deladev.fr/llms.txt)
- **Spec OpenAPI :** [`/openapi.json`](https://foodtruck.deladev.fr/openapi.json)
