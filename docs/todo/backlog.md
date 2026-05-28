# Backlog

> Items not yet scheduled in a sprint. Ordered roughly by priority.
> When an item is moved to a sprint, delete it from here.

---

## 🔴 High Priority

- [ ] **Audit Home — Sprint B (mobile)** : `dvh`, `invalidateSize`, scroll-lock, z-index, tap targets ≥44px — voir `docs/audits/audit-home-2026-05-28.md`
- [ ] **Audit Home — Sprint C (UX polish)** : empty state, sessionStorage, safe-area iOS — voir audit

## 🟡 Medium Priority

- [ ] **Multiple locations per truck** : a truck can appear at several spots on the same day
- [ ] **Multiple schedule slots** : support morning + afternoon slots (e.g. 11h–14h and 18h–21h)

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
