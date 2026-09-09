# AppLayout — TruckMap

**Dernière mise à jour :** 2026-07-11
**Fichier source :** [`resources/js/Layouts/AppLayout.vue`](../../resources/js/Layouts/AppLayout.vue)

---

## Rôle

Layout racine utilisé par toutes les pages. Fournit la navbar fixe, les bandeaux contextuels (démo, IA) et l'offset de contenu correspondant.

---

## Structure

```
AppLayout
├── <header>          fixed top-0 h-14 z-50   ← Navbar
├── <DemoBanner>      fixed top-14 z-50        ← Affiché si isDemo + page ≠ Home
├── <AiBanner>        fixed top-14|top-22 z-50 ← Affiché si page ≠ Home
└── <main>            pt-14|pt-22|pt-32        ← Offset selon bandeaux visibles
    └── <slot />
```

---

## Bandeaux contextuels

| Bandeau | Condition | Position |
|---|---|---|
| `DemoBanner` | `isDemo && page ≠ Home` | `top-14` (sous navbar) |
| `AiBanner` | `page ≠ Home` | `top-14` si DemoBanner absent, `top-22` sinon |

`AiBanner` lit l'état dismissed de `DemoBanner` via [`useDemoBanner`](../../resources/js/Composables/useDemoBanner.ts) pour ajuster dynamiquement son `top`.

---

## Offset `<main>`

| Contexte | Classe | Calcul |
|---|---|---|
| Home | `pt-14` | Navbar seule (56px) |
| Autres pages, pas démo | `pt-22` | Navbar (56px) + AiBanner (~32px) |
| Autres pages, démo | `pt-32` | Navbar (56px) + DemoBanner (32px) + AiBanner (~40px) |

---

## Navbar

- Logo `🚚 TruckMap` → `/`
- **Connecté :** lien "Mon espace" (`/mon-truck`) + bouton "Déconnexion" (desktop), bouton "Mon espace" seul (mobile)
- **Non connecté :** lien "Connexion" (desktop) + bouton `+ Mon truck` → `/enregistrer`

Les données `auth.user` viennent du `Inertia::share` dans [`AppServiceProvider`](../../app/Providers/AppServiceProvider.php).

---

## Props partagées (via Inertia::share)

| Prop | Type | Description |
|---|---|---|
| `auth.user` | `{ id, name } \| null` | Utilisateur connecté |
| `cuisines` | `Cuisine[]` | 10 types de cuisine (pour SearchBar) |
| `flash.success` | `string \| null` | Message flash succès |
| `flash.error` | `string \| null` | Message flash erreur |
| `isDemo` | `boolean` | Environnement de démo actif |
