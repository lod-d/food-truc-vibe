# Backlog

> Items not yet scheduled in a sprint. Ordered roughly by priority.
> When an item is moved to a sprint, delete it from here.

---

## 🔴 High Priority

- [ ] **Photo upload — storage:link** : run `php artisan storage:link` in prod setup docs
- [ ] **Truck admin panel** : allow truck owners to edit/delete their truck (requires basic auth)
- [ ] **Duplicate prevention** : detect similar truck names on registration to avoid duplicates
- [x] **Map geolocation** : "Locate me" button to center the map on the user's current position
- [ ] **Pagination / infinite scroll** : the truck list panel needs pagination for large datasets

## 🟡 Medium Priority

- [ ] **Multiple locations per truck** : a truck can appear at several spots on the same day
- [ ] **Multiple schedule slots** : support morning + afternoon slots (e.g. 11h–14h and 18h–21h)
- [ ] **Truck search by name** : text search input in the panel (in addition to cuisine filter)
- [ ] **Date picker on map** : view trucks scheduled for a future date
- [ ] **Email notification on registration** : confirm to the truck owner that their truck is live
- [ ] **Responsive popup** : `TruckPopup.vue` on desktop should use a Leaflet popup, not just the side panel
- [ ] **Map bounds filter** : only fetch trucks visible in the current map viewport
