---
title: Theme CSS
linkTitle: css
date: 2026-03-30
summary: "How pihuw.css is organised and how to customise the theme"
---

## How to customise the theme in 5 minutes

Edit only **section 1 — Colors & Fonts** in `assets/css/pihuw.css`.
Change the raw palette variables (`--mm-*`) and optionally the typography vars.
Everything else is derived — all component rules reference `var(--*)` tokens so
they follow automatically.

This file is arranged so that Claude code can update the documentation directly
from a modified pihuw.css file. If you are so smart that you don't need any
documentation then feel free to update the format of the doc.

---

## ≡≡≡ 1. Colors & Fonts

`assets/css/pihuw.css` section 1 lives inside `:root {}` and is split into four sub-blocks:

### 1a — User palette

Raw HSL values the webmaster edits to customise:

| Variable      | Default              | Role                               |
| ------------- | -------------------- | ---------------------------------- |
| `--mm-yellow` | `hsl(46, 50%, 52%)`  | Primary highlight                  |
| `--mm-green`  | `hsl(80, 45%, 49%)`  | Accent / nav                       |
| `--mm-purple` | `hsl(324, 45%, 42%)` | Secondary highlight                |
| `--mm-blue`   | `hsl(243, 36%, 39%)` | Tertiary / code                    |
| `--mm-dark`   | `hsl(0, 0%, 20%)`    | Text colour (light mode)           |
| `--mm-light`  | `hsl(0, 0%, 93%)`    | Page background (light mode)       |
| `--mm-white`  | `hsl(0, 0%, 100%)`   | Card / nav background (light mode) |

The `--mrx-*` variables are the metarex.media project palette — a second named palette that
coexists with `--mm-*`. Rename to your project if needed.

### 1b — Derived tokens

Computed from the palette using CSS only (no hardcoded values):

| Token                     | Derived from                    | Used in                   |
| ------------------------- | ------------------------------- | ------------------------- |
| `--hi1`–`--hi4`           | `--mm-yellow/purple/green/blue` | headings, borders, labels |
| `--bg1`–`--bg4`           | `hsl(from var(--hiN) h s 95%)`  | card backgrounds          |
| `--text`                  | `--mm-dark`                     | `body`                    |
| `--meta`                  | lightened `--mm-dark`           | `.meta`                   |
| `--pi-code`                  | `--mm-blue`                     | `code`                    |
| `--pihuw-teal`            | literal `#35BDB2`               | `.logo-pi`                |
| `--graph-c1`–`--graph-c4` | `--hi1`–`--hi4`                 | Chart.js via JS           |

### 1c — Typography

```css
--font-body: "Arial", sans-serif;
--font-mono: "Courier New", monospace;
--font-narrow: "Arial Narrow", Arial, sans-serif;
--font-size-base: 16px;
--line-height-base: 1.25;
```

To use Google Fonts: add `@import url(...)` at the top of `static/site.css` and
override these variables in `:root` there.

### 1d — Breakpoints

```css
--break-s: 500px; /* small:  mobile / portrait phones */
--break-m: 800px; /* medium: tablets / low-res screens */
--break-w: 1100px; /* wide:   TVs, 4K, desktop */
```

**Important:** CSS variables cannot be used inside `@media (max-width: …)` queries.
The px values in the media queries are hardcoded and must be kept in sync with these
variables manually. Each media query has a comment naming the variable it mirrors.

---

## ≡≡≡ 2. Dark mode

Three CSS blocks immediately follow `:root {}`:

| Block                                 | Mechanism          | Wins when                     |
| ------------------------------------- | ------------------ | ----------------------------- |
| `@media (prefers-color-scheme: dark)` | OS preference      | No `data-theme` attribute set |
| `[data-theme="light"]`                | Attribute selector | `<html data-theme="light">`   |
| `[data-theme="dark"]`                 | Attribute selector | `<html data-theme="dark">`    |

Attribute selectors have higher specificity than the media query, so they always win.
All three blocks override only `--mm-dark`, `--mm-light`, `--mm-white` — the derived tokens
follow automatically.

**JS behaviour:**

- `assets/js/theme-init.js` — inlined in `<head>` before CSS loads; reads
  `localStorage('pihuw-theme')` and sets `data-theme` immediately to prevent FOUC.
- `assets/js/theme-toggle.js` — loaded with `defer`; cycles `system → light → dark → system`
  on click of any `[data-theme-toggle]` element.
- The toggle button lives in `layouts/_partials/tmpl/navbar.html`.

---

## ≡≡≡ 3. Base HTML

Bare element overrides for `body`, `h1`–`h6`, `code`, `hr`, `th`.

These exist because markdown content authors cannot add CSS classes to these elements —
Hugo's markdown renderer emits plain HTML. Rules here use only colour tokens; no layout.

---

## ≡≡≡ 4. PicnicCSS overrides

Rules that target PicnicCSS class names:

- `.card.hi1` through `.card.hi4` — coloured highlight cards
- `.button` — overrides PicnicCSS default with `--hi1`
- `.breadcrumb` — top margin, no border

---

## ≡≡≡ 5. Navigation

All nav rules: `.pi-nav`, `.pi-nav-pad`, brand elements, `.pi-menu-w/n`,
logo colours, `#siteTitleMenu`, and the full dropdown set.

Responsive `@media` queries for `.pi-nav-pad` are here (not scattered elsewhere).

---

## ≡≡≡ 6. Page layout

Structural layout for the content area: `section>div.block`, `.src.block`, `.txt.block`,
`main div.page-title`, `.block-hr`, `section footer`, `.pi-reading-time`.

---

## ≡≡≡ 7. Components

Each sub-component has its own ASCII heading:

- **Banner** — `.banner`, `.banner .text`, `.banner .header`
- **Footer** — `.footer` and all child selectors, `.pi-footer-label`, `.pi-footer-title`
- **Sidebar** — bare `sidebar {}` selector (custom HTML element, not a class — do not rename)
- **Childbar** — `.childbar-horizontal`
- **Definition block** — `.definition-block .card`, `.definition-block .card header`
- **Accordion / Tab** — `.tab`, `.tab__*`, `.accordion`, `.pi-tog-o/c` and related states

---

## ≡≡≡ 8. Taxonomies & labels

`.pi-tax-1`–`.pi-tax-4.label` — colour classes assigned by `tmpl/taxonomy-display-class.html`
based on ordinal position in `site.Taxonomies`.

The `.ui.` prefix has been removed from these selectors. `tool/label.html` emits
`<span class="label label-X">` without the `.ui.` prefix.

`.pi-flex-with-tags`, `.pi-flex-title-tags`, `.label-blog`, `.meta` and its children.

---

## ≡≡≡ 9. Media

`.image`, `section img`, `main footer.caption`.

---

## ≡≡≡ 10. Graph

`.hw-graph` and `.hw-graph-error`. The `--graph-c1`–`--graph-c4` palette vars are defined
in section 1b (`:root`) and read by Chart.js via `getComputedStyle`.

---

## ≡≡≡ 11. Animations

`@keyframes bounce` (accordion icon), `@keyframes hue-rotate` (hr rainbow).

Responsive view classes `.view-s`, `.view-m`, `.view-w` and their `@media` queries are also
here. These are pure CSS presentation switches — no JS involved.

---

## For Claude: update checklist

- **Adding a new component** → add CSS to section 7 with an ASCII sub-heading; update this doc
- **Adding a colour token** → add to section 1b and update the token table above
- **Adding a bare HTML override** → check section 3 first; prefer a class where possible
- **Adding a breakpoint** → update section 1d, add `@media` rules where needed, update section 2 table
- **Section names** in this file must always match the `≡≡≡` comments in `pihuw.css`
- **No `.ui.` prefixes** on taxonomy selectors — the template does not emit them
- **No `lighten()`** — use CSS relative colour syntax: `hsl(from var(--x) h s calc(l + 25%))`
- **No `var()` in `@media` queries** — hardcode px and add a comment naming the variable
