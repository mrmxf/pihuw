# Site styling

## site.css

Create **`assets/css/site.css`** and put your site-specific CSS tweaks in it.

It is loaded last — after picnic, pihuw.css and the icon font — so anything in it
wins over the theme on equal specificity. In production it is minified,
fingerprinted and given an SRI hash, which means it can be cached forever and you
can comment it as freely as you like: the comments never reach the browser. Under
`hugo server` it is served untouched so it stays readable in devtools.

```text
assets/
└── css/
    └── site.css      <- your overrides
```

### Moving from static/site.css

Earlier versions of pihuw looked for `static/site.css`, and **that still works** —
nothing breaks if you leave it there. It is simply served as-is, with no
minification and no fingerprint, so it cannot be cached across deploys.

To upgrade, move the file:

```bash
mkdir -p assets/css && git mv static/site.css assets/css/site.css
```

If `assets/css/site.css` exists it always wins; `static/site.css` is only used as
a fallback. pihuw logs a one-line warning when it falls back. To keep the file
where it is and silence the warning, add this to your site config:

```yaml
ignoreLogs:
  - pihuw-site-css-static
```

### Web fonts

Do not `@import` a font stylesheet at the top of `site.css`. An `@import` cannot
start downloading until the importing stylesheet has itself arrived and been
parsed, which serialises two round trips before any text can paint. Use a real
`<link>` in `layouts/_partials/hook/head-end.html` instead:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap">
```

Then redeclare `--font-body`, `--font-narrow` and `--font-mono` in your
`site.css`.

## style overrides pihuw.css

The colour system is described in [css](../css/). Prefer overriding the tokens
from `site.css` — replacing `assets/css/pihuw.css` wholesale means merging by
hand on every theme upgrade.

## Hiding the theme toggle

If your `site.css` forces a single theme, the light/dark/system button is a
control that does nothing. Turn it off in `params.yaml`:

```yaml
ui:
  hide:
    themeToggle: true
```

This removes the button **and** stops `theme-toggle.js` being shipped at all —
it is not merely hidden with CSS. `theme-init.js` still runs, so nothing else
about theming changes.

## ui.page.bodyClass
