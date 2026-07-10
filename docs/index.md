# Documentation TruckMap

**Dernière mise à jour :** 2026-07-11

Annuaire interactif de food trucks en France — Laravel 13 + Inertia.js + Vue 3 + Leaflet.

---

## Navigation

### Base

| Fichier | Contenu |
|---|---|
| [`base/ARCHITECTURE.md`](base/ARCHITECTURE.md) | Conventions, structure, modèles, flux de données |
| [`base/DESIGN_SYSTEM.md`](base/DESIGN_SYSTEM.md) | Palette, typo, composants UI, styles Leaflet |
| [`base/DEPLOY.md`](base/DEPLOY.md) | Docker, Dokploy, variables d'environnement |
| [`base/CAHIER_DES_CHARGES.md`](base/CAHIER_DES_CHARGES.md) | Spécifications initiales V1 |

### Référence technique

| Fichier | Contenu |
|---|---|
| [`api.md`](api.md) | Endpoints REST, paramètres, schémas de réponse |
| [`routes.md`](routes.md) | Toutes les routes web + API avec diagramme |

### Composables

| Fichier | Contenu |
|---|---|
| [`composables/useMap.md`](composables/useMap.md) | Wrapper Leaflet — markers, flyTo, popup |
| [`composables/useTrucks.md`](composables/useTrucks.md) | Fetch réactif `/api/trucks` + pagination |
| [`composables/useGeocoding.md`](composables/useGeocoding.md) | Nominatim (geocodage France) |

### Composants clés

| Fichier | Contenu |
|---|---|
| [`components/AppLayout.md`](components/AppLayout.md) | Layout racine, navbar, bandeaux, offset main |
| [`components/MapView.md`](components/MapView.md) | Wrapper Leaflet exposant flyTo/showUserLocation |
| [`components/TruckPopup.md`](components/TruckPopup.md) | Popup Leaflet montée via createApp |

### Features

| Fichier | Contenu |
|---|---|
| [`features/feature-map-view.md`](features/feature-map-view.md) | Spec carte interactive |
| [`features/feature-register-wizard.md`](features/feature-register-wizard.md) | Wizard 3 étapes enregistrement |
| [`features/feature-fake-data-seeder.md`](features/feature-fake-data-seeder.md) | Seeder données de démo |
| [`features/feature-ux-redesign-guidelines.md`](features/feature-ux-redesign-guidelines.md) | Guidelines UX |

### Sprints

| Sprint | Sujet |
|---|---|
| [`sprints/sprint-1-v1-beta.md`](sprints/sprint-1-v1-beta.md) | V1 Beta |
| [`sprints/sprint-2-design-alignment.md`](sprints/sprint-2-design-alignment.md) | Alignement design |
| [`sprints/sprint-3-finition.md`](sprints/sprint-3-finition.md) | Finitions |
| [`sprints/sprint-4-polish.md`](sprints/sprint-4-polish.md) | Polish |
| [`sprints/sprint-5-date-picker.md`](sprints/sprint-5-date-picker.md) | Date picker |
| [`sprints/sprint-6-auth-admin.md`](sprints/sprint-6-auth-admin.md) | Auth + espace admin |
| [`sprints/sprint-7-home-fixes.md`](sprints/sprint-7-home-fixes.md) | Correctifs Home |
| [`sprints/sprint-8-demo-environment.md`](sprints/sprint-8-demo-environment.md) | Environnement démo |

### Suivi

| Fichier | Contenu |
|---|---|
| [`todo/backlog.md`](todo/backlog.md) | Items non planifiés |

---

## Stack en un coup d'œil

```
Backend   : Laravel 13 · PHP 8.3+ · MySQL 8 · Pest (tests)
Frontend  : Vue 3 · TypeScript · Inertia.js v2 · Tailwind CSS v4
Carte     : Leaflet 1.9 + leaflet.markercluster
Géocodage : Nominatim (OpenStreetMap) — France uniquement
Déploiement : Docker multi-stage · Dokploy · Traefik TLS
```

## Points d'entrée code

| Quoi | Où |
|---|---|
| Page d'accueil + carte | [`resources/js/pages/Home.vue`](../resources/js/pages/Home.vue) |
| Wizard enregistrement | [`resources/js/pages/Register/Index.vue`](../resources/js/pages/Register/Index.vue) |
| Espace admin | [`resources/js/pages/Admin/Index.vue`](../resources/js/pages/Admin/Index.vue) |
| Layout racine | [`resources/js/Layouts/AppLayout.vue`](../resources/js/Layouts/AppLayout.vue) |
| API trucks (backend) | [`app/Http/Controllers/TruckController.php`](../app/Http/Controllers/TruckController.php) |
| Modèle Schedule | [`app/Models/Schedule.php`](../app/Models/Schedule.php) |
| Partage données globales | [`app/Providers/AppServiceProvider.php`](../app/Providers/AppServiceProvider.php) |
