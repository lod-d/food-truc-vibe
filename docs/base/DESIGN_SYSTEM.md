# TruckMap — Design System

> Référence complète du design system. À consulter avant tout travail sur les composants Vue.

---

## Principes

1. **Minimal** — chaque élément a une raison d'être, pas de décoration superflue
2. **Chaleureux** — couleurs street food, jamais froid ou corporate
3. **Lisible** — typographie claire, contrastes WCAG AA minimum
4. **Cohérent** — les mêmes composants partout, les mêmes classes Tailwind

---

## Couleurs

### Primaires

| Token | Hex | Usage |
|-------|-----|-------|
| `coral-400` | `#D85A30` | CTA principaux, markers ouverts, accents |
| `coral-600` | `#993C1D` | Hover état primaire |
| `coral-50`  | `#FAECE7` | Fond badges cuisine, surfaces actives |
| `coral-100` | `#F5C4B3` | Hover surfaces légères |

### Neutres warm-gray

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-50`  | `#F1EFE8` | Fond de page |
| `warm-200` | `#D3D1C7` | Borders, séparateurs |
| `warm-500` | `#888780` | Texte secondaire, markers fermés |
| `warm-900` | `#2C2C2A` | Texte principal |

### Sémantiques

| Token | Hex | Usage |
|-------|-----|-------|
| `open-50`  | `#EAF3DE` | Fond badge "ouvert" |
| `open-600` | `#639922` | Texte badge "ouvert", dot vert |

---

## Typographie

Police : **Inter** (Google Fonts) — charger uniquement les weights 400 et 500.

```html
<!-- Dans app.blade.php -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

| Rôle | Classe Tailwind | Rendu |
|------|----------------|-------|
| Titre principal (H1) | `text-2xl font-medium` | 24px / 500 |
| Titre section (H2) | `text-lg font-medium` | 18px / 500 |
| Titre carte/popup | `text-sm font-medium` | 15px / 500 |
| Corps | `text-sm` | 14px / 400 |
| Méta / muted | `text-xs text-warm-500` | 12px / 400 |
| Label champ | `text-xs text-warm-500` | 12px / 400 |

---

## Spacing

Basé sur la grille Tailwind (1 unité = 4px) :

| Token | Valeur | Usage |
|-------|--------|-------|
| `gap-2` | 8px | Espacement interne composants |
| `gap-3` | 12px | Entre éléments dans un groupe |
| `p-4` | 16px | Padding card standard |
| `gap-4` | 16px | Grille principale |
| `mb-6` | 24px | Séparation entre sections |
| `p-6` | 24px | Padding wizard |

---

## Composants

### AppButton

```vue
<!-- Variants : primary | secondary | ghost -->
<AppButton variant="primary">Enregistrer mon truck</AppButton>
<AppButton variant="secondary">Annuler</AppButton>
<AppButton variant="ghost">Voir tous les trucks →</AppButton>
```

Classes Tailwind correspondantes :

```
primary   : bg-coral-400 hover:bg-coral-600 text-white rounded-md px-5 py-2.5 text-sm font-medium transition-colors
secondary : border border-warm-200 hover:bg-warm-50 text-warm-900 rounded-md px-5 py-2.5 text-sm transition-colors
ghost     : text-coral-400 hover:text-coral-600 text-sm underline-offset-2 hover:underline
```

### AppBadge

```vue
<AppBadge variant="open">● Ouvert maintenant</AppBadge>
<AppBadge variant="closed">Fermé</AppBadge>
<AppBadge variant="cuisine">🍔 Burger</AppBadge>
```

Classes :

```
open    : bg-open-50 text-open-600 rounded-full px-3 py-0.5 text-xs font-medium
closed  : bg-warm-50 text-warm-500 rounded-full px-3 py-0.5 text-xs
cuisine : bg-coral-50 text-coral-600 rounded-full px-3 py-0.5 text-xs
```

### AppInput

```vue
<AppInput
  v-model="city"
  placeholder="Rechercher une ville..."
  :icon="SearchIcon"
/>
```

Classes :

```
w-full border border-warm-200 rounded-md px-3 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent
placeholder:text-warm-500 bg-white
```

### AppCard

```vue
<AppCard>
  <TruckInfo :truck="truck" />
</AppCard>
```

Classes :

```
bg-white border border-warm-200 rounded-lg p-4
```

### StepIndicator

```vue
<StepIndicator :steps="['Mon truck', 'Emplacement', 'Horaires']" :current="2" />
```

États visuels :

```
done   : bg-open-50 text-open-600 border border-open-300 — affiche "✓"
active : bg-coral-400 text-white
future : bg-white text-warm-500 border border-warm-200
ligne done   : bg-open-300
ligne future : bg-warm-200
```

---

## Leaflet — Styles markers

### Marker standard

Teardrop orienté vers le bas, emoji cuisine au centre.

```css
.truck-marker {
  width: 40px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #D85A30;           /* ouvert */
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}

.truck-marker.closed {
  background: #888780;
  opacity: .65;
}

.truck-marker .emoji {
  transform: rotate(45deg);
  font-size: 16px;
  line-height: 1;
}
```

### Cluster

```css
.truck-cluster {
  width: 40px;
  height: 40px;
  background: #D85A30;
  border: 3px solid rgba(216, 90, 48, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}
```

### Popup

Popup Leaflet stylisée via CSS global :

```css
.leaflet-popup-content-wrapper {
  border-radius: 12px !important;
  border: 0.5px solid #D3D1C7 !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.leaflet-popup-tip {
  background: white !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  width: 200px !important;
}
```

---

## Responsive

Breakpoints utilisés (Tailwind) :

| Breakpoint | Largeur | Comportement |
|-----------|---------|-------------|
| (mobile) | < 768px | Carte plein écran, panel en bottom sheet |
| `md:` | ≥ 768px | Layout carte + panel côte à côte |
| `lg:` | ≥ 1024px | Panel plus large (280px), filtres visibles |

### Bottom sheet mobile (panel trucks)

```vue
<!-- Sur mobile : panel en bas, hauteur 40vh par défaut, draggable vers 80vh -->
<div :class="[
  'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl border-t border-warm-200 z-50',
  'md:static md:rounded-none md:border-0 md:w-72'
]">
```

---

## Animations

Uniquement via Tailwind `transition-*` — pas de librairie d'animation.

```
Hover boutons    : transition-colors duration-150
Hover card liste : transition-colors duration-100
Marker Leaflet   : transition géré par leaflet.markercluster nativement
```
