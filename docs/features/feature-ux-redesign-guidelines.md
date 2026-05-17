# TruckMap — UX/UI Redesign Guidelines

> Research-based recommendations for making TruckMap feel polished and competitive.  
> Based on analysis of: Google Maps, Yelp, Zomato, Foursquare, Roaming Hunger, Street Food Finder, TruckUnion.

---

## 1. Competitive Landscape Analysis

### 1.1 Google Maps / Apple Maps (reference baseline)

**Layout:** Full-screen map with a bottom sheet panel on mobile; a persistent left sidebar on desktop that includes search, filters, and results all in one scrollable column. The panel never fights the map — the map is always the hero.

**Filters:** Hidden by default behind a "Filters" button that opens a modal/drawer on mobile. On desktop, filter chips appear just below the search bar in a horizontal strip. Active filters show a count badge ("Filters · 2") to signal state without cluttering the UI.

**Card design:** Cards in results show: thumbnail photo (left, square crop), name, rating + review count, cuisine category, open/closed status with hours, distance. The photo is mandatory — cards without a photo feel incomplete and users skip them.

**Markers:** Simple colored dots (minimal), scaling up to pins with a thumbnail photo when zoomed in. Selected state: the marker grows and the card in the list highlights simultaneously (bi-directional sync).

**Detail panel:** Tapping a marker opens a bottom sheet that slides up to 40% height showing core info. Swiping up reveals the full detail page. Never a new page navigation — always an in-panel expansion.

### 1.2 Yelp

**Layout:** Split view (list left, map right) on desktop. Mobile is list-first with a "Map" toggle button that switches the entire view.

**Filters:** Prominent horizontal chip row: category, distance, price, open now, more. Each chip is a standalone filter. Tapping opens an inline dropdown (not a full modal). This is faster than a modal for single-dimension filtering.

**Card design:** Large thumbnail (16:9 or square), name in medium-weight type, star rating + review count, price range, category tags, "Open until X:XX" (not just open/closed — the exact closing time is key for food decisions), distance from user location.

**Key insight:** Yelp shows the closing time prominently because users want to know "do I have time?" not just "is it open?".

**Mobile/desktop difference:** On mobile, Yelp hides the map completely and shows a list. The map is a secondary view. This is the opposite of the current TruckMap approach where the map dominates and the list is a cramped bottom sheet.

### 1.3 Zomato / Foursquare

**Discovery-first:** These apps open on a city/neighborhood level with category browsing before the map. The map is a secondary explore mode, not the entry point.

**Card hierarchy:** Photo > Name > Open status > Rating > Cuisine. The visual hierarchy is driven by photos — an app without them looks like a skeleton.

**Color language:** Zomato uses a strong brand red (#E23744) consistently. Foursquare uses deep navy + teal accent. Both use color sparingly — one strong CTA color, neutrals for everything else. Nothing uses multiple accent colors simultaneously.

### 1.4 Roaming Hunger (direct food truck competitor)

**Layout:** Full-screen map on desktop with a left sidebar for results. The sidebar is collapsible. The map is the core interaction surface.

**Filters:** A top bar with: search input | city | date | cuisine category | dietary filters. Date is a first-class filter, not an afterthought. The "Today" / "Tomorrow" / date picker is clearly separated.

**Marker design:** Simple colored circles with an "FT" or cuisine icon inside. Open trucks use a bright color (orange/red). Closed trucks are grayed out. Selected truck marker increases in size and shows a tooltip above.

**Card in sidebar:** Photo thumbnail (left, square, 64×64), name in bold, location street + city, today's hours or "Closed today", a small cuisine tag badge. No star ratings (trust signals differ in food truck context — social proof is usually Instagram followers or review count).

**Mobile:** The app is primarily desktop-focused. Mobile has a map-first approach with a collapsible list that slides up from the bottom.

**Key insight from Roaming Hunger:** The truck photo is shown even in list view at small size. Users scan by photo before they read names.

### 1.5 Street Food Finder / TruckUnion

**Street Food Finder** focuses on a map-first experience with date-based scheduling as the primary filter. The UI is utilitarian — it works but lacks polish.

**TruckUnion** takes a social/community approach: trucks have profiles with social media links, reviews, and event-style scheduling. The detail panel feels like an event listing (with date prominently shown).

**Common patterns across food truck apps:**
- Date is a top-level filter, not buried in the sidebar
- Schedule information (not just open/closed) is shown on every card
- Instagram/social links are part of the core data shown
- Location name (e.g., "Marché des Enfants Rouges") is shown instead of raw addresses
- No star ratings in food truck apps — social proof is different

---

## 2. Layout Patterns

### 2.1 What works in the current TruckMap layout

- The split view (map left, panel right) is standard for desktop and correct.
- The bottom sheet approach on mobile is correct for a map-centric app.
- The `calc(100vh - 56px)` full-height map is right — no wasted space.

### 2.2 What to change

**Desktop:**

The sidebar is currently on the **right** side. Competitive research shows left sidebars are more intuitive for discovery apps because users read left-to-right: they browse the list, then look right to confirm on the map. **Move the panel to the left.**

The panel width is 288px (w-72) / 320px (lg:w-80). This is tight. Industry standard for this type of app is **360–400px** to show cards with photos without cramping.

The cuisine chips are currently in a separate bar **below** the map (`border-t` at the bottom). This creates visual separation from the rest of the filter UI. Move them **into the top of the sidebar** as the first filter element, not in a disconnected bar.

**The navbar cuisine chips (emoji-only)** in AppLayout are decorative and non-functional for filtering. Remove them or wire them up. Unused interactive elements create confusion.

**Mobile:**

The current bottom sheet is at `max-h-[45vh]` fixed. This is too short — users can see 2-3 cards before needing to scroll, and there is no drag handle interaction. Implement **two snap points**: 30% (just filters + 1 card peek) and 75% (full list). The 30% snap shows the filter chips and the top of the list as an invitation to scroll up.

The mobile popup for selected trucks is currently a floating card `absolute bottom-6 left-1/2`. This creates z-index conflicts with the bottom sheet. Use a dedicated **mid-screen modal** or integrate into the bottom sheet's expanded state instead.

---

## 3. Filtering Presentation

### 3.1 Current state problems

- Cuisine filter chips are in a separate footer bar on desktop — disconnected from other filters
- The "open now" toggle is floating over the map (bottom-left) — users don't expect a core filter to live on the map canvas
- The date picker is an `<input type="date">` — platform-inconsistent, hard to style, no context about what dates have trucks
- Search, date, and toggle are in the sidebar header; cuisine chips are below the map — three different zones for related filters

### 3.2 Recommended filter architecture

**Desktop sidebar (top section, above the list):**

```
[ Search input: "Rechercher un truck…"    ] [icon]
[ Chips: Tous | 🍔 Burger | 🌮 Tacos | … (scrollable horizontal) ]
[ Today | Tomorrow | [Date picker]   ] [ ● Ouverts maintenant toggle ]
[ 12 trucks trouvés ]
─────────────────────────────────────────
[ Truck cards list ... ]
```

All filter controls in one contiguous block. The map has zero filter UI on it (except geolocation button, which is a map tool, not a filter).

**Mobile bottom sheet:**

The bottom sheet in its collapsed (30%) state shows:
```
[ ══ drag handle ══ ]
[ Search ]  [ Date: Aujourd'hui ▾ ]
[ Chips: Tous | Burger | Tacos | … ]
──── ( list peeks below ) ────
```

Expanded (75%): shows the full list below the filters.

### 3.3 Specific filter component changes

**Date filter:** Replace `<input type="date">` with a custom 3-button control:
```
[ Aujourd'hui ] [ Demain ] [ Choisir… ]
```
"Choisir…" opens a popover date picker. This eliminates the ugly native date input on all platforms and makes the two most common use cases (today, tomorrow) one-tap actions.

**Open now toggle:** Move from the map overlay to the filter bar. It should sit next to the date control since they are logically related (you can only filter "open now" for today). Visual coupling reinforces the logic.

**Cuisine chips:** Make them horizontally scrollable with hidden scrollbar. Show at most 6-7 chips before cutoff (the rest scroll into view). Add a subtle right fade gradient to signal scrollability. The "Tous" chip should always be the first, pinned on the left (sticky while others scroll).

**Active filter indicator:** When any filter is active (cuisine selected, future date, open now = true), show a small coral dot or count on a "Filtres" summary label. This lets users know filters are applied when the filter bar scrolls out of view.

---

## 4. Truck Card Design

### 4.1 Current card hierarchy

```
[emoji 2xl] [name sm/medium] [● Ouvert / Fermé badge]
            [address xs/warm-500 truncate]
            [HH:MM – HH:MM xs/warm-500]
```

This is clean but lacks visual anchoring. The emoji is too small to create a real thumbnail effect. Cards feel like text-only list items.

### 4.2 Recommended card hierarchy

The photo should be introduced as the leading visual element. Cards without photos use the cuisine emoji on a colored background as a fallback — not just the emoji floating next to text.

**With photo:**
```
[ Photo thumbnail 72×72, rounded-lg ] | [name sm/medium]
                                       | [cuisine badge]
                                       | [● Ouvert until 14:30] or [Fermé]
                                       | [Place name, City · distance]
```

**Without photo (fallback):**
```
[ coral-50 bg, emoji centered, 72×72 ] | [same as above]
```

**Key changes:**
- Thumbnail size: 64–72px square, `rounded-lg`, `object-cover`
- Show the closing time ("Ouvert jusqu'à 14:30") not just "Ouvert" — this is the most actionable info for a food truck user
- Show distance from user location when geolocation is granted (even rough: "~500m", "~2 km")
- The cuisine type as a small badge (current design) is good — keep it
- Remove the "Fermé" badge from the card list view — closed trucks are already de-emphasized; the negative badge adds noise. Instead, reduce the opacity of closed truck cards (`opacity-60`) and show "Fermé aujourd'hui" only in the popup.
- Add a horizontal separator between open and closed trucks with a label: "Ouverts maintenant" / "Autres trucks"

### 4.3 Selected state

Currently: `border-coral-400 ring-1 ring-coral-400`. This works but the visual difference is subtle.

Recommendation: Add a left border accent in addition to the ring:
```
border-l-2 border-l-coral-400 ring-1 ring-coral-400
```
And synchronize: when a marker is clicked on the map, the corresponding card scrolls into view in the sidebar (`.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`).

---

## 5. Marker Design

### 5.1 Current marker

The teardrop marker (50% 50% 50% 0, rotated -45deg) is visually distinctive and on-brand. This is a good differentiator — keep the shape.

### 5.2 What to improve

**Size:** 40×40px is the minimum for comfortable tapping on mobile. The touch target should be at least 44×44px (Apple HIG). Add `padding: 4px` to the invisible hit area without changing the visual size.

**Selected state:** Currently no selected state on the marker when a card is clicked. Add a visual selected state: white border becomes thicker (3px → 4px), marker scales up (`transform: scale(1.25)`), and a subtle shadow deepens. Use CSS transitions.

**Closed trucks:** The 65% opacity on closed markers is correct. Consider a lighter gray (`#C5C4BD`) instead of `#888780` — the current gray is too close to the base map color on CartoDB Positron, making closed markers nearly invisible.

**Cluster marker:** The current design (solid coral circle with count) is good. To improve legibility at a glance, add a ring of trucks as small dots around the cluster count for clusters > 5 (like Airbnb's map clusters). This is optional but premium-feeling.

**Photo markers at high zoom:** When zoom >= 15, replace the emoji teardrop with a mini photo thumbnail marker (32×32px circle with `object-cover`, bordered in coral). This is what Google Maps does to confirm "yes, this is the place I see on the street." This requires passing `photo_url` into the marker creation in `useMap.js`.

---

## 6. Popup / Detail Panel

### 6.1 Current popup (220px Leaflet popup)

The popup is functional. The photo at the top, name, status badge, cuisine badge, hours, address, and social links in 220px is a well-structured hierarchy.

### 6.2 Desktop: keep the Leaflet popup, improve its content

Width: increase to 260px. The current 200px (set in CSS) is too narrow for French addresses.

Add: a "Voir le profil" or "Voir sur la carte" button at the bottom of the popup that links to a future `/trucks/:id` detail page. Even if the page doesn't exist yet, the affordance should be there as a `disabled` or placeholder.

Add: for trucks with Instagram, show the @handle visibly rather than just "Instagram" as link text. `@burgerbros` is more recognizable and feels native to street food culture.

Show the city name and, if available, `place_name` with a map pin icon (📍 or SVG pin) before the address. Currently it's plain truncated text.

### 6.3 Mobile: replace the floating card with a proper bottom drawer

Current implementation: `absolute bottom-6 left-1/2 -translate-x-1/2` — a floating card that can overlap the bottom sheet.

Replace with: when a marker is tapped on mobile, the bottom sheet **snaps to 55% height** and shows the selected truck's detail at the top of the sheet, above the list. The close button dismisses the selection and snaps the sheet back to 30%.

This is the pattern used by Airbnb, Google Maps, and Roaming Hunger — the bottom sheet is a single surface that adapts to what's selected.

Implementation approach in Vue: add a `mode` ref to the bottom sheet (`'list' | 'detail'`). In `'detail'` mode, render the `TruckPopup` content at the top of the sheet, followed by a separator, followed by the list (which becomes secondary). In `'list'` mode, render only filters + list.

---

## 7. Color Scheme and Visual Language

### 7.1 Current palette assessment

The 8-token palette is strong and appropriate for food discovery:
- Coral (#D85A30) as primary: warm, food-adjacent, distinctive
- Warm gray neutrals: avoids the clinical feel of cool grays
- Open green (#639922): semantic and clear

**Issues:**
- `warm-500` (#888780) is used for secondary text AND for closed truck markers. When closed markers appear on the warm-50 map background, the contrast is insufficient.
- The `coral-100` token is defined in the design system but does not appear to be used anywhere. Remove or use it for hover states.

### 7.2 Additions recommended (within the 8-token constraint)

Do not add new color tokens. Instead, use opacity modifiers to extend the palette:
- `coral-400/10` as a very light tint for hover states on cuisine chips
- `open-600/80` for the dot indicator in the "ouvert" badge (already green, just softer)
- `warm-900/60` for secondary text hierarchy instead of `warm-500` in some contexts

### 7.3 Typography

The constraint of Inter 400 + 500 only (no bold, no semibold) creates a uniform, calm typographic voice. This is intentional and good — street food app aesthetics trend toward casual confidence, not aggressive hierarchy.

**One addition:** consider using `font-medium` (500) + `tracking-wide` (`letter-spacing: 0.02em`) for cuisine badge text. This makes the small labels more legible at 12px and gives them a slightly branded feel without adding a new weight.

### 7.4 Visual language of competitive apps (summary)

| App | Brand color | Neutral base | Key visual differentiator |
|-----|------------|--------------|--------------------------|
| Google Maps | Blue (#1A73E8) | White | Photo-first cards, seamless map integration |
| Yelp | Red (#D32323) | White/light gray | Large photo thumbnails, rating stars |
| Roaming Hunger | Orange (#FF6B35) | White | Schedule-first, date calendar |
| Street Food Finder | Teal (#2BB5A0) | Light | Map markers with truck icon |
| Zomato | Red (#E23744) | White | Full-bleed photos, event-like cards |

TruckMap's coral is well-positioned in this landscape — neither Yelp-red nor Roaming Hunger-orange. The warm base color (warm-50) is unique and differentiating. Keep it.

---

## 8. Mobile vs Desktop Differences — Summary

| Element | Desktop (current) | Desktop (recommended) | Mobile (current) | Mobile (recommended) |
|---------|-------------------|----------------------|-------------------|---------------------|
| Map position | Right (flex-1) | Left (flex-1) | Full screen | Full screen |
| Panel position | Right sidebar, 288-320px | Left sidebar, 360px | Bottom sheet fixed 45vh | Bottom sheet, 2 snap points: 30% / 75% |
| Cuisine chips | Footer bar (bottom of page) | Top of sidebar, scrollable | In bottom sheet | In collapsed bottom sheet |
| Open now toggle | Floating on map (bottom-left) | In sidebar filter bar | In bottom sheet | In collapsed bottom sheet |
| Date filter | `<input type="date">` | 3-button: Today/Tomorrow/Custom | `<input type="date">` | 3-button: Today/Tomorrow/Custom |
| Selected truck | Card highlight + Leaflet popup | Card highlight + Leaflet popup + scroll into view | Floating card above bottom sheet | Bottom sheet snaps to detail mode |
| Truck cards | Emoji + text, no photo | Photo thumbnail + text | Emoji + name + badge | Photo thumbnail + name + badge |
| Navbar | Logo + emoji chips + CTA | Logo + CTA (no emoji chips — move to sidebar) | Logo + CTA | Logo + CTA |

---

## 9. Actionable Recommendations — Prioritized

### Priority 1 — High impact, low effort

1. **Move cuisine chips into the sidebar**, remove the disconnected footer bar. The chips belong with the other filters.

2. **Move the "open now" toggle into the sidebar** filter section (next to the date filter). Remove it from the map canvas.

3. **Replace `<input type="date">` with a Today/Tomorrow/Custom button group.** Custom opens a floating datepicker. This is the highest UX improvement per line of code.

4. **Add scroll-into-view on card selection.** When a marker is clicked on the map, the selected card in the sidebar list should scroll into view. Currently the user has no feedback in the list when interacting with the map.

5. **Show closing time instead of just "Ouvert".** Change `● Ouvert` to `● Ouvert jusqu'à 14:30` in both the card and the popup. The time is already in `todays_schedule.closes_at`.

6. **Remove the decorative emoji chips from the navbar.** They are non-functional and visually competing with the brand logo. The space is wasted on desktop.

### Priority 2 — Medium impact, medium effort

7. **Add photo thumbnails to truck cards.** The `photo_url` field exists in the data. Show a 64×72px thumbnail on the left of each card. Use a coral-50 background with the cuisine emoji centered as the no-photo fallback. This single change elevates the visual quality of the list dramatically.

8. **Move the panel to the left side on desktop.** Map on the right, sidebar on the left. This matches user reading direction and competitive apps (Roaming Hunger, Google Maps).

9. **Implement two snap points for the mobile bottom sheet.** 30% (filters visible, list peek) and 75% (full list). Use CSS transitions with a drag gesture. The `@vueuse/core` package already in the project has `useSwipe` for this.

10. **Add a selected marker state.** When a truck card is clicked or a marker is tapped, the corresponding Leaflet marker should visually change: scale up to 1.2× and increase border width. Implement via a `selectedMarkerId` ref in `useMap.js`.

11. **Separate open/closed trucks in the list with a section header.** "Ouverts maintenant (3)" / "Autres (17)". Sort open trucks to the top. This is already partially implied by the filter but the visual separation is missing.

### Priority 3 — High impact, higher effort

12. **Mobile bottom sheet detail mode.** When a marker is tapped on mobile, instead of the floating card, snap the bottom sheet to 55% and show the truck detail at the top of the sheet. Requires adding a `mode` state to the bottom sheet component.

13. **Photo markers at high zoom (>= 15).** Replace emoji teardrop markers with 32px circle photo thumbnails when the user is zoomed in enough to see individual locations clearly. Dramatically improves the "is this the truck I see in front of me?" experience.

14. **Active filter count indicator.** Show a small count badge ("Filtres · 2") when multiple filters are active. Helps users understand why fewer results appear.

15. **Instagram @handle in popup.** Show `@burgerbros` instead of "Instagram" as link text. More natural in the food truck cultural context.

---

## 10. What NOT to Change

- **The coral/warm palette.** It is differentiated and on-brand. Do not add more accent colors.
- **The Inter 400/500 typography constraint.** The restrained typographic voice is correct.
- **The Leaflet teardrop marker shape.** It is distinctive. Improve the selected state and photo variant, but keep the shape.
- **The CartoDB Positron tile layer.** The light, clean base map lets the markers and the coral palette breathe. A dark map or a satellite view would fight the design system.
- **The single-cuisine filter.** Multi-select cuisine filtering sounds useful but in practice most users want one category at a time. Keep single-select for now.
- **The "Charger plus" pagination pattern.** Infinite scroll would break the map-list sync. Explicit load more is correct.

---

## 11. Reference Visual Hierarchy (card, ideal state)

```
┌─────────────────────────────────────────┐
│ [Photo 64px]  Burger Bros               │
│ [coral-50 bg] ● Ouvert jusqu'à 14:30    │
│ [emoji if no] 🍔 Burger         ~500m   │
│    photo]     📍 Marché des Enfants Rouges │
└─────────────────────────────────────────┘
```

**Hierarchy reading order:**
1. Photo (visual scan, instant identification)
2. Name (confirmation)
3. Open status + closing time (decision trigger: "do I have time?")
4. Cuisine category (category confirmation)
5. Distance + location name (logistics)

This is the hierarchy used by Yelp, Roaming Hunger, and Google Maps results. It is driven by how users actually make decisions about food: first "does it look good?" then "is it open now?" then "is it close enough?".
