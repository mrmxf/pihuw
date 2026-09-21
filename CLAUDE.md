# CLAUDE.md — PiHuW

Hugo theme on PicnicCSS, consumed as a Hugo module by six sites. Small footprint, no
CDNs, Hugo built-ins only — it targets Raspberry Pi and ESP32 hosting.

`clog watch` serves locally, `clog github-page` publishes the docs.
There is no `clog build`/`clog deploy` here — consumer sites define those, the theme does not.
Verify any change with `hugo --quiet`: it must exit 0.

`documentation/content/` is the docs site. `module.yaml`'s local-dev self-import mounts it
as `content/`, so a bare clone builds it — no symlink needed. `clog watch` still creates one;
never leave it behind, `clog Check build` fails on a stale link.

## Detail — read on demand, not every query

| Topic | File |
|---|---|
| Build, module, config | [claude-build.md](claude-build.md) |
| Deploy, gh-pages, Actions | [claude-deploy.md](claude-deploy.md) |
| Known issues | [claude-backlog.md](claude-backlog.md) |
| Why the theme is shaped this way | [claude-human-narrative.md](claude-human-narrative.md) |
| Human-facing docs | [README.md](README.md) |

## Layout

```
config/_default/       hugo.yaml, params.yaml, module.yaml
assets/css/            picnic.min.css, fa6.min.css — vendor only
assets/css/pihuw/      the theme CSS, split by concern; see its README.md
assets/data/           defaults.yaml — every component default class and setting
documentation/content/ docs site, mirrors layouts/ one-to-one
layouts/               baseof, home, list, single + _markup/, _shortcodes/
layouts/_partials/
  hook/                empty consumer extension points
  tk/                  toolkit — value-returning, asset resolution, debug
  tmpl/                layout blocks — head, nav, footer, pagination
  tool/                components, one per {{< hw t="..." >}}; each has X-help.html
.clog.yaml             watch, github-page, checks
```

Catalogues are deliberately absent. `ls layouts/_partials/tool/` is current; a table is not.

## Rules

### Hugo
- `partial` not `template`. Always pass a dict as the dot, never a bare page.
- `.Store` not `.Scratch`. `.Scratch` was removed in Hugo 0.148.
- `try (resources.Get ...)` for any fallible lookup.

### Value-returning partials — any `$x := partial "..." .`
- Zero text output. Comments, whitespace or debug silently discard the return; caller gets `""`.
- Never call `tk/dbg-template` in one. Say so in the comment block.
- `{{- -}}` trim on both sides of every action. No bare text, no untrimmed blank lines.
- One `return`, as the last line. Init `$ret` to the falsy default and assign into it.
- No early-exit returns. Gold standard: `tk/get-asset.html`, `tk/img-process.html`.

### The `$img` dict
- Images move between partials only as an `$img` dict — never a raw resource or a path string.
- Fields are documented in `tk/get-asset-help.html`. That help file is the contract.
- Pipeline: `tk/get-asset` resolves the path, `tk/img-process` applies process strings.
- `isStatic` means no resource object, so no processing is possible. Check it before processing.
- `isGif` may be animated. `isRaster` deliberately excludes gif.

### tool/ partials
- Resolve assets via `tk/get-asset`. Never `.Resources.Get`, `.Match` or `.GetMatch`.
- Transform via `tk/img-process`. Never `.Process` or `.Fit`.
- Featured images via `tk/resource-image-featured`.
- Pass `.page` lowercase, so page-bundle and shortcode contexts both work.
- Logic lives in the `tool/` partial; the shortcode is a thin wrapper.

### hook/ partials
- Six `begin`/`end` pairs. Inertness is a documented promise: no theme feature may depend
  on one, and none may emit anything in production.
- Never add default content. Consumers copy the whole folder, so their stale empty
  override would silently suppress it.
- Hugo resolves each name to exactly one file. An empty copy still wins and shadows below.
- A feature needing a fixed page position goes in a `tmpl/` partial, called from the base.
- Names are `hook/x` and `main-begin`. `my/head-*` was the name up to v0.4.3; `tk/hook-*`
  and `main-start` never shipped, so do not describe them as deprecated.
- A rename here silently breaks consumers: Hugo stops looking the old name up and exits 0.
  Treat one as breaking, and state the version a hook appeared in. See claude-backlog.md.
- All six are called by any base template emitting `<html>`/`<body>` — `baseof.html` and
  `blog/section.html`. Templates that only `define "main"` must not: they would fire twice.

### CSS bundle
- The theme CSS is `assets/css/pihuw/*.css`, concatenated by `tmpl/head-css` into one
  minified, fingerprinted request. Numeric prefixes ARE the cascade order; they step in
  5s and 10s so a file can be inserted without renaming.
- `sort (resources.Match ...) "Name"` is load-bearing. `resources.Match` returns the
  project's files before the module's, NOT in filename order — without the sort a
  consumer's `61-*.css` loads before the theme's `00-tokens.css`. Verified, not theoretical.
- A consumer overrides one file by name in their own `assets/css/pihuw/`. Theirs replaces
  the theme's wholesale and keeps its cascade position — same stale-copy hazard as `hook/`.
  Prefer a token redefinition or a rule in `site.css`; file replacement is the escape hatch.
- New `tool/X` CSS goes in `assets/css/pihuw/6N-component-X.css`, not an inline `<style>`.
  Only config-generated CSS stays inline: `resp-classes` (@media from params), `gallery`
  (per-media colours), `typist` (font @import).
- There is no `assets/css/pihuw.css`. `tmpl/head-css` warns if a consumer still has one.

### On-demand libraries
- A render hook flags a need with `.Store.Set "hasX"`; `tmpl/body-scripts.html` reads it and
  loads the library. Mermaid and Chart.js work this way.
- The read MUST be at end of `<body>`. In `<head>` the flag is unset, because a render hook
  only runs when `.Content` renders.
- Gate on the `hasX` flag, not on a params `enable` key, so it works with no config. Treat
  `enable: false` as an opt-out only.

### Debug
- `tk/dbg-template` only in output-generating partials, only inside `{{- if hugo.IsServer -}}`.
- Surface key-value data with `tk/dbg.html` or `tool/dbg.html`. Both are server-only.
- No dead `$DBG := false`. Wire it up or delete it.

### Comment blocks
Every partial opens with path, one-line description, `.param — type — description
(required|optional, default)`, then `returns (type — description)` and the dbg-template
warning if it returns a value.

### Authors
- Authors touch frontmatter and shortcode params. Nothing else.
- They never write process strings, never see `res`/`src`/`$img`, never trace a call chain.
- Take human aliases — `size: "small"`, not `process: "resize x80"`.
- Defaults go in `params.yaml` and `assets/data/defaults.yaml`.

### Consumers
- Override a partial by name in the consumer's `layouts/`. Never fork or copy one.
- Exception: the whole `hook/` folder may be copied, because every file is empty by contract.
- Multi-theme precedence is out of scope. See `documentation/content/hook/_index.md`.

### Docs
- New `tool/X`: add `X.html`, `X-help.html`, `"X"` to `$tools` in `tk/help.html`,
  `documentation/content/tool/X.md`, and a live example in `content/kitchen_sink/X.md`.
- `content/tool/X.md` is frontmatter plus `{{< hw t="X" help="yes" >}}`. The index
  auto-lists via `item-group-by-type`; never hand-maintain it.
- New `tmpl/` or `tk/` partial: add a row to that section's `_index.md`.
- `tk/` is developer-only and stays out of the `t="help"` author index.
