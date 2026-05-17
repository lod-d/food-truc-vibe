# Contributing to TruckMap

Thank you for your interest in contributing! This document explains how to participate in this project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Style](#code-style)

---

## Code of Conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## How to Contribute

1. **Browse open issues** — look for issues labeled `good first issue` or `help wanted`
2. **Comment on the issue** you want to work on before starting (avoid duplicate work)
3. **Fork the repo**, create a branch, implement your change
4. **Open a Pull Request** against `main`

---

## Development Setup

```bash
# Fork then clone
git clone https://github.com/<your-username>/truckmap.git
cd truckmap

# PHP dependencies
composer install

# JS dependencies
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database (MySQL 8 required)
# Create a `truckmap` database in your MySQL instance, then:
php artisan migrate --seed

# Run dev servers (two terminals)
php artisan serve
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000).

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code |
| `feat/<name>` | New features (e.g. `feat/truck-ratings`) |
| `fix/<name>` | Bug fixes (e.g. `fix/marker-cluster-crash`) |
| `chore/<name>` | Maintenance, dependency updates |
| `docs/<name>` | Documentation only changes |

Always branch off `main`. Never commit directly to `main`.

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons (no logic change) |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates |

**Examples:**

```
feat(map): add geolocation button to center map on user
fix(schedule): correct day-of-week mapping for Sunday
docs(readme): add storage:link step to setup guide
chore(deps): update leaflet to 1.9.5
```

---

## Pull Request Process

1. **One feature / fix per PR** — keep changes focused
2. **Fill the PR template** — describe what changed and why
3. **Link the issue** — use `Closes #123` in the PR description
4. **Self-review** — read your own diff before requesting review
5. **No WIP PRs** — only open a PR when the work is ready to review
6. **CI must pass** — fix any build or lint errors before review
7. A maintainer will review within a few days; address requested changes promptly

### PR Template

```markdown
## What

<!-- Brief description of the change -->

## Why

<!-- The problem this solves or feature it adds -->

## How

<!-- Key implementation decisions -->

## Testing

<!-- How to test this change locally -->

Closes #<issue-number>
```

---

## Reporting Bugs

Open an issue with the **Bug report** template and include:

- A clear, descriptive title
- Steps to reproduce (numbered)
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment: OS, PHP version, Node version, browser

---

## Suggesting Features

Open an issue with the **Feature request** template and include:

- The user problem you are solving
- Your proposed solution
- Alternatives you considered
- Any mockups or examples

Features should align with the V1 scope defined in `docs/base/CAHIER_DES_CHARGES.md`.

---

## Code Style

### PHP

- Follow the existing Laravel conventions (see `docs/base/ARCHITECTURE.md`)
- PSR-12 formatting enforced by Laravel Pint: `./vendor/bin/pint`
- No comments unless the WHY is non-obvious
- UUIDs for all primary keys (use `HasUuids` trait)

### Vue / TypeScript

- Composition API (`<script setup>`) only — no Options API
- TypeScript for all `.vue` files
- No `any` unless unavoidable and justified
- Props typed with `defineProps<{...}>()`
- Emits typed with `defineEmits<{...}>()`

### CSS / Tailwind

- No custom CSS classes except for Leaflet markers (`.truck-marker`, `.truck-cluster`, `.leaflet-popup-*`)
- No `@apply` outside `app.css`
- Use design token colors (`coral-400`, `warm-900`, etc.) — do not hardcode hex values in templates

### General

- No `console.log` in committed code
- No dead code or commented-out blocks
- Env variables go in `.env.example` (with empty or example values)
