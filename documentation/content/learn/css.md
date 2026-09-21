---
title: Theme CSS
linkTitle: css
date: 2026-03-30
summary: "How the theme CSS is organised and how to customise it"
---

## How to customise the theme in 5 minutes

Redefine the raw palette variables (`--mm-*`), and optionally the typography
vars, in your own `assets/css/site.css`. Everything else is derived — every
component rule reads a `var(--*)` token, so it follows automatically.

You do not need to edit the theme to restyle it. The tokens are listed below;
`assets/css/pihuw/00-tokens.css` is where the theme defines them.

---

## Where the CSS lives

The theme's CSS is **not** one file. It is a directory of small files, one per
concern, concatenated into a single minified, fingerprinted request at build time:

```
assets/css/pihuw/
  00-tokens.css              05-theme-dark.css      10-base.css
  20-picnic.css              30-nav.css             40-layout.css
  50-component-banner.css …  60-component-cover.css …
  70-taxonomy.css            80-media.css           90-animation.css
```

**The numeric prefix is the cascade order.** Prefixes step in 5s and 10s so a file
can be inserted without renaming its neighbours.

### Overriding one component

Put a file of the same name in your own site:

```
your-site/assets/css/pihuw/65-component-tooltip.css
```

Hugo's union filesystem gives yours precedence and keeps the theme's cascade
position. No configuration. Your file *replaces* the theme's rather than merging
with it, so you stop receiving theme updates to that component — prefer
redefining a token, or adding a rule to `assets/css/site.css`, when that is enough.

`assets/css/pihuw/README.md` has the full mechanism.

## ≡≡≡ 1. Colors & Fonts

*Source: `assets/css/pihuw/00-tokens.css`*

`00-tokens.css` lives inside `:root {}` and is split into five sub-blocks:

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
| `--bg1`–`--bg4`           | `oklch(from var(--hiN) …)` tint | card backgrounds          |
| `--text`                  | `--mm-dark`                     | `body`                    |
| `--meta`                  | lightened `--mm-dark`           | `.meta`                   |
| `--pi-code`                  | `--mm-blue`                     | `code`                    |
| `--pihuw-teal`            | literal `#35BDB2`               | `.logo-pi`                |
| `--graph-c1`–`--graph-c4` | `--hi1`–`--hi4`                 | Chart.js via JS           |

### 1c — Component tokens

Compositing surfaces for `tool/` components. Each follows the theme by default; override a single
var in your `site.css` to restyle that component on every page.

| Token               | Light         | Dark          | Used in                                  |
| ------------------- | ------------- | ------------- | ---------------------------------------- |
| `--pi-scrim`        | black / 0.75  | black / 0.85  | lightbox and modal backdrops             |
| `--pi-scrim-media`  | black / 0.45  | black / 0.55  | scrim over a cover photograph            |
| `--pi-on-scrim`     | white         | white         | text and controls sitting on a scrim     |
| `--pi-on-scrim-dim` | white / 0.3   | white / 0.3   | muted control on a scrim (spinner track) |
| `--pi-shadow`       | black / 0.10  | black / 0.45  | resting elevation — gallery tile         |
| `--pi-shadow-hover` | black / 0.20  | black / 0.60  | raised elevation — hover, dropdown       |
| `--pi-shadow-float` | black / 0.30  | black / 0.65  | floating elevation — phone mock          |
| `--pi-tooltip-bg`   | `#222222`     | `#4D4D4D`     | `tool/tooltip` surface and arrow         |
| `--pi-tooltip-fg`   | `--hi1`       | `--hi1`       | `tool/tooltip` text                      |

Two deliberate exceptions:

- **Scrims and `--pi-on-scrim` do not invert.** They sit over photographs, where the text
  contrast floor has to hold whatever the page theme is. Only their strength changes.
- **`tool/smschat` phone chrome is not themed.** It depicts a physical iOS screen, so its
  status and input bars stay iOS-coloured. Only its drop shadow uses a token.

### 1d — Typography

```css
--font-body: "Arial", sans-serif;
--font-mono: "Courier New", monospace;
--font-narrow: "Arial Narrow", Arial, sans-serif;
--font-size-base: 16px;
--line-height-base: 1.25;
```

To use Google Fonts: add `@import url(...)` at the top of `static/site.css` and
override these variables in `:root` there.

### 1e — Breakpoints

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

*Source: `assets/css/pihuw/05-theme-dark.css`*

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

*Source: `assets/css/pihuw/10-base.css`*

Bare element overrides for `body`, `h1`–`h6`, `code`, `hr`, `th`.

These exist because markdown content authors cannot add CSS classes to these elements —
Hugo's markdown renderer emits plain HTML. Rules here use only colour tokens; no layout.

---

## ≡≡≡ 4. PicnicCSS overrides

*Source: `assets/css/pihuw/20-picnic.css`*

Rules that target PicnicCSS class names:

- `.card.hi1` through `.card.hi4` — coloured highlight cards
- `.button` — overrides PicnicCSS default with `--hi1`
- `.breadcrumb` — top margin, no border

---

## ≡≡≡ 5. Navigation

*Source: `assets/css/pihuw/30-nav.css`*

All nav rules: `.pi-nav`, `.pi-nav-pad`, brand elements, `.pi-menu-w/n`,
logo colours, `#siteTitleMenu`, and the full dropdown set.

Responsive `@media` queries for `.pi-nav-pad` are here (not scattered elsewhere).

---

## ≡≡≡ 6. Page layout

*Source: `assets/css/pihuw/40-layout.css`*

Structural layout for the content area: `section>div.block`, `.src.block`, `.txt.block`,
`main div.page-title`, `.block-hr`, `section footer`, `.pi-reading-time`.

---

## ≡≡≡ 7. Components

*Source: `assets/css/pihuw/50-component-*.css and 60-component-*.css`*

Each sub-component has its own ASCII heading:

- **Banner** — `.banner`, `.banner .text`, `.banner .header`
- **Footer** — `.footer` and all child selectors, `.pi-footer-label`, `.pi-footer-title`
- **Sidebar** — bare `sidebar {}` selector (custom HTML element, not a class — do not rename)
- **Childbar** — `.childbar-horizontal`
- **Definition block** — `.definition-block .card`, `.definition-block .card header`
- **Accordion / Tab** — `.tab`, `.tab__*`, `.accordion`, `.pi-tog-o/c` and related states

---

## ≡≡≡ 8. Taxonomies & labels

*Source: `assets/css/pihuw/70-taxonomy.css`*

`.pi-tax-1`–`.pi-tax-4.label` — colour classes assigned by `tmpl/taxonomy-display-class.html`
based on ordinal position in `site.Taxonomies`.

The `.ui.` prefix has been removed from these selectors. `tool/label.html` emits
`<span class="label label-X">` without the `.ui.` prefix.

`.pi-flex-with-tags`, `.pi-flex-title-tags`, `.label-blog`, `.meta` and its children.

---

## ≡≡≡ 9. Media

*Source: `assets/css/pihuw/80-media.css`*

`.image`, `section img`, `main footer.caption`.

---

## ≡≡≡ 10. Graph

*Source: `assets/css/pihuw/85-component-graph.css`*

`.hw-graph` and `.hw-graph-error`. The `--graph-c1`–`--graph-c4` palette vars are defined
in section 1b (`:root`) and read by Chart.js via `getComputedStyle`.

---

## ≡≡≡ 11. Animations

*Source: `assets/css/pihuw/90-animation.css`*

`@keyframes bounce` (accordion icon), `@keyframes hue-rotate` (hr rainbow).

Responsive view classes `.view-s`, `.view-m`, `.view-w` and their `@media` queries are also
here. These are pure CSS presentation switches — no JS involved.

---

## For Claude: update checklist

- **Adding a new component** → add `assets/css/pihuw/5N-` or `6N-component-X.css`; update this doc
- **Adding a colour token** → add to `00-tokens.css` (1b or 1c) and update the token table above
- **Adding a bare HTML override** → check `10-base.css` first; prefer a class where possible
- **Adding a breakpoint** → update `00-tokens.css` (1e), add `@media` rules, update the section 2 table
- **Section names** in this file must match the filenames in `assets/css/pihuw/`
- **No `.ui.` prefixes** on taxonomy selectors — the template does not emit them
- **No `lighten()`** — use CSS relative colour syntax in oklch: `oklch(from var(--x) calc(l + 0.2) calc(c * 0.75) h)`
- **No `var()` in `@media` queries** — hardcode px and add a comment naming the variable
