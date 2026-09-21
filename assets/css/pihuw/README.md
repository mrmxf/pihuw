# pihuw CSS bundle

Every `*.css` file in this directory is concatenated, minified and fingerprinted
into **one** stylesheet request by `layouts/_partials/tmpl/head-css.html`.
Splitting the source costs the visitor nothing.

## Order

**The numeric prefix is the cascade order.** Files are sorted by filename, so
`00-tokens.css` lands first and `90-animation.css` last. Prefixes step in 5s and
10s so you can insert a file without renaming anything.

| Prefix | What lives there                                    |
| ------ | --------------------------------------------------- |
| `00`   | design tokens — palette, derived colours, typography |
| `05`   | dark mode tri-state                                  |
| `10`   | base HTML elements                                   |
| `20`   | PicnicCSS overrides                                  |
| `30`   | navigation                                           |
| `40`   | page layout                                          |
| `50-5x`| theme components — banner, footer, sidebar, …        |
| `60-6x`| `tool/` components — cover, gallery, tooltip, …      |
| `70`   | taxonomies and labels                                |
| `80`   | media                                                |
| `85`   | graph                                                |
| `90`   | animations                                           |

## Overriding one file from your own site

Put a file of the **same name** in your site's `assets/css/pihuw/`:

```
your-site/assets/css/pihuw/65-component-tooltip.css
```

Hugo's union filesystem gives your file precedence, and it keeps the theme's
cascade position. Nothing to configure.

> Your file **replaces** the theme's completely — it is not merged. You will not
> pick up later theme changes to that component, the same trade-off as copying a
> `hook/` partial. Prefer the two lighter options below when they are enough.

## Three ways to restyle, lightest first

1. **Redefine a token** in `assets/css/site.css`. Most components are driven by
   custom properties — `--pi-tooltip-bg`, `--pi-shadow`, `--bg1`. This survives
   theme upgrades.
2. **Add a rule** in `assets/css/site.css`. It loads after the bundle, so it wins
   on equal specificity.
3. **Replace a file** here, as above. Full control, no future updates.

## Adding your own file to the bundle

Any `*.css` you drop in your site's `assets/css/pihuw/` joins the bundle at its
sorted position — `95-mine.css` loads after everything the theme ships. This is
only worth doing when you need a specific cascade position; otherwise use
`assets/css/site.css`.

## Not in the bundle

Three stylesheets stay inline in their partials because they are generated from
site config and cannot be static files:

- `tmpl/resp-classes.html` — `@media` queries built from `params.responsive`
  (CSS variables are not allowed in media queries)
- `tool/gallery.html` — per-media-type colour classes from `params.ui.gallery`
- `tool/typist.html` — a Google Fonts `@import` chosen by parameter
