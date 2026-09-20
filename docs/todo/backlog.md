# Backlog

> Items not yet scheduled in a sprint. Ordered roughly by priority.
> When an item is moved to a sprint, delete it from here.

---

## 🔴 High Priority

- [ ] **Audit Home — Sprint B (mobile)** : `dvh`, `invalidateSize`, scroll-lock, z-index, tap targets ≥44px — voir `docs/audits/audit-home-2026-05-28.md`
- [ ] **Audit Home — Sprint C (UX polish)** : empty state, sessionStorage, safe-area iOS — voir audit
- [ ] **`paginate(20)` sur la carte** : la carte plafonne à 20 trucks quel que soit le viewport, et `loadMore()` se fait écraser par le refetch au pan — voir `TruckController.php:62`

## 🟡 Medium Priority

- [ ] **Multiple locations per truck** : a truck can appear at several spots on the same day
- [ ] **Multiple schedule slots** : support morning + afternoon slots (e.g. 11h–14h and 18h–21h)
- [ ] **Index DB manquants** : aucun index sur `locations.latitude/longitude` ni `schedules.day_of_week` / `is_cancelled` / `is_recurring` / `specific_date`. Indolore à ~300 trucks, bloquant après. Le Haversine en `whereRaw` (`TruckController.php:43`) ne peut de toute façon en utiliser aucun — préfiltrer par bounding box avant de calculer la distance
- [ ] **La CI ne garde pas le build qui part en prod** : `lint.yml` fait `npm install`, `tests.yml` fait `npm i` — tous deux réparent l'arbre en silence. Seul le Dockerfile fait `npm ci`, strict. Un `package-lock.json` désynchronisé passe donc la CI au vert et casse le déploiement Dokploy. Passer les deux workflows à `npm ci`
- [ ] **Erreur API visible** : le `catch` de `useTrucks` se contente d'un `console.error`. Un 429 ou une coupure réseau vide la carte sans rien dire à l'utilisateur
- [ ] **Comparaison de bounds par valeur** dans `useMap` : `docs/composables/useMap.md` la documente, elle n'existe pas dans le code. Le debounce du Sprint 9 réduit la casse sans la remplacer
- [ ] **Nominatim → BAN** : `useGeocoding` tape `nominatim.openstreetmap.org` (≈1 req/s, sans User-Agent identifiant, usage applicatif hors politique OSM). `api-adresse.data.gouv.fr` est franco-français, sans clé, nettement plus rapide
- [ ] **CLAUDE.md ment sur `HomeController@index`** : il est documenté comme passant les trucks via props Inertia (« pas d'appel API au premier rendu »), alors qu'il fait un `Inertia::render('Home')` nu — d'où un aller-retour API de plus au premier affichage. Décider lequel des deux a raison
- [ ] **`photo_url` en URL absolue** : `asset('storage/...')` est figé en base (`TruckController.php:115`), les images cassent dès que démo et prod n'ont pas le même domaine
- [ ] **Sessions et cache en base sur la démo** : `SESSION_DRIVER=database` + `CACHE_STORE=database` ajoutent une à deux écritures MySQL par requête, appels API compris. `file` suffirait

---

## ✅ Done (moved to sprint docs)

- [x] **Map geolocation** : "Locate me" button — Sprint 2
- [x] **Truck search by name** : text search input in the panel — Sprint 3
- [x] **Responsive popup** : desktop Leaflet popup via `createApp(TruckPopup)` — Sprint 3
- [x] **Map bounds filter** : only fetch trucks visible in the current map viewport — Sprint 3
- [x] **Truck admin panel** : auth Laravel native + CRUD edit/delete — Sprint 6
- [x] **Photo upload — storage:link** : documented in README with prod context — Sprint 5
- [x] **Date picker on map** : filter trucks by future date, toggle disabled when non-today — Sprint 5
- [x] **Pagination** : "Charger plus" in truck list panel, 20/page — Sprint 4
- [x] **Email notification on registration** : Mailable + blade template, sent if email provided — Sprint 4
- [x] **Duplicate prevention** : name check via `GET /api/trucks/check-name`, warning in Step 1 — Sprint 4
