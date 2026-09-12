# claude-backlog.md — known issues

Not read every query. Read it before touching a listed file, or when picking up debt work.

Severity: **B** blocking / incorrect output · **M** moderate debt · **C** cosmetic

## Found 2026-09-12

| # | Where | Issue |
|---|---|---|
| B-05 | `.clog.yaml:47` | `BUILD_DIR="public"` but `hugo.yaml` sets `publishDir: kodata`. The `cd public` fails, so deploy is broken. |
| B-06 | `.github/workflows/gh-static.yml` | `HUGO_VERSION: 0.159.0` is below `module.yaml` min `v0.161.0`. |
| M-15 | `tk/get-asset-help.html` | Documents `tool/thumb`, `tool/img` and `tool/srcset`. None exist. The old CLAUDE.md called `tool/thumb` a gold-standard reference. |
| C-13 | `.clog.yaml:128` | `[ -f hugo .yaml ]` — stray space, so the test never matches. |
| C-14 | `.clog.yaml:113` | `suffix:` snippet has an unbalanced trailing `"`. |
| C-15 | `.clog.yaml:119` | `project has fomantic` cats `layouts/_partials/tmpl/head-cdn`, which no longer exists. The check always fails. |

## FIXED 2026-09-12 — B-07, mermaid never loaded

`_markup/render-codeblock-mermaid.html` set `hasMermaid` and nothing read it, so the theme
emitted `<pre class="mermaid">` and never loaded the library. Every consumer had to DIY a
loader — which is how www-mrmxf-com's went stale for months.

Fix: `tmpl/body-scripts.html` now reads `hasMermaid` and loads mermaid, mirroring the
`hasGraph`/Chart.js block beside it. End of `<body>` is required: a render hook's
`.Store.Set` is invisible in `<head>`, because the flag is only set once `.Content` renders.

- Loads only on pages containing a fence. No fence, no request.
- Classic build, not ESM, so `window.mermaid` exists for consumer pages that call it.
- Themed from `data-theme` on `<html>` (dark|light|absent=system), and re-renders on the
  theme toggle via a MutationObserver plus a `prefers-color-scheme` listener.
- `mermaid.enable: false` opts out. `mermaid.version` pins a release, default 11.6.0.

Verified in headless Chrome: both diagrams on `kitchen_sink/mermaid` render to real SVG
(`flowchart-v2`, `sequence`); forcing `data-theme="dark"` changes the SVG palette
(`stroke:#333333` -> `stroke:lightgrey`); `enable: false` emits no script tag; and a page
with no fence emits none either.

Note `markmap` and `katex` still have `enable` keys that nothing reads, and `graph.enable`
is decorative too — `hasGraph` is what gates Chart.js.

## Renaming an extension point breaks consumers silently

Six sites consume this theme. A renamed partial does not error in a consumer build — Hugo
simply stops looking the old name up, the override emits nothing, and `hugo` exits 0. Two of
the six have been broken this way. Treat any rename below as a breaking change: bump the
minor version, and say so in `releases.yaml`.

The head extension point has moved three times:

| pihuw | Name looked up |
|---|---|
| v0.2.1 – v0.3.1 | `my-head-end.html` (flat) and `partials/my/head-end.html` |
| v0.3.3 – v0.4.3 | `my/head-end.html` |
| v0.4.4 – now | `hook/head-end` |

`body-begin`, `main-begin` and `main-end` did not exist before v0.4.4, and have only ever
been `hook/*`. The toolkit dir renamed separately: `hw-tk/` up to v0.4.1, `tk/` from v0.4.3.

Two names consumers believe in that this theme has NEVER shipped:

- `tk/head-begin` / `tk/head-end` — www-mrmxf-com held its mermaid loader and a nav script
  at `tk/head-end.html`. Nothing emitted them. The likely cause is a consumer applying the
  `hw-tk/` -> `tk/` toolkit rename to their own `my/` hook overrides: two unrelated
  namespaces, one rename.
- `tk/hook-body-begin` and five siblings — hand-written stubs whose comments describe "the
  theme copy" as intentionally empty. No such theme copy ever existed.

Consequence for the docs: `hook/` docs must state the version a hook appeared in. A consumer
on v0.4.3 reading current docs will write `hook/head-end` and get silence.

Related: two consumers still carry a `cdn:` params block feeding `tmpl/head-cdn.html`, which
this theme no longer ships. See `C-15`, and www-mrmxf-com `B-05`.

## Overrides in www-chiddingfoldbonfire that belong in this theme

Audited 2026-09-12 against v0.4.5: 15 override files, of which 4 are generic and 3 exist
only to work around a theme bug. Chiddingfold is the newest consumer and the most careful,
so its overrides are a good read on what the theme is missing.

### Root cause to fix first

| # | Where | Work |
|---|---|---|
| B-08 | `tk/get-asset.html:91` | `$src = $res.RelPermalink` runs unconditionally, and touching `.RelPermalink` is what WRITES the resource, so asking about an image publishes the original. |

Chiddingfold measured ~8 MB of unlinked originals from this, including a 2.2 MB JPEG, and
wrote `tk/img.html` to avoid it: for raster it returns `res` with `src` deliberately EMPTY
so the caller processes and publishes only what it uses. Fix `get-asset` the same way and
`tk/img` can be deleted. This affects all six consumers and contradicts the no-CDN,
small-footprint goal more than anything else in the backlog.

### Generic code to adopt

| # | From | Work |
|---|---|---|
| M-16 | `tk/date-offset.html` | Offset a time by `1w`/`5w-1d`/`3h5m` and format it, with an `ordinal` format. Fully generic; only the comments mention bonfires. |
| M-17 | `_markup/render-image.html` | No image render hook in the theme, so a plain `![alt](img/x.jpg)` ships full size. This emits resized WebP with srcset and lazy loading. Depends on B-08. |
| M-18 | `hook/head-end.html` | Canonical URL, Open Graph and Twitter cards — the theme emits none. Extract to `tmpl/head-seo.html`; leave the font `<link>` behind. |
| M-19 | `hook/body-end.html` | Consent-gated analytics. The theme offers nothing, so the obvious thing is unconditional GA — a UK PECR problem. Take the mechanism, leave the banner copy. |

### Theme bugs these overrides route around

| # | Where | Issue |
|---|---|---|
| B-09 | `tool/cover.html` | Emits raw CSS with no `<style>` wrapper, so the rules render as visible text. Also hardcodes a `<video>` section pointing at the image's `.src`. Unusable. |
| M-20 | `tool/item-socials.html` | 166 bytes: a debug call and a comment, renders nothing. Yet it is in the `$tools` slice, so the help index documents a component that does not exist. |

`tool/heroimage.html` is the working reference for what `cover` should be: srcset capped at
the native width (Hugo upscales silently), `min-height:100svh` so the mobile URL bar does not
make the hero jump, and the opacity filter on the image only, not the text.

### Worth a look, not a clear move

- `_shortcodes/timing.html` reads a key from site data and `errorf`s on a miss. The theme's
  `md-param` reads PAGE params only, so there is no site-data equivalent. A `tool/site-param`
  would generalise it.
- `_shortcodes/action.html` / `actions.html` are a card grid that may overlap `tool/item`,
  `tool/item-group` and `tool/feature`. Check whether the site should use those before the
  theme gains another component.
- `_shortcodes/sponsors.html` is "logo grid from a data file, skip `active: false`, WebP the
  rasters". The pattern is generic; the heading and data path are not.

### Correctly site-specific — leave alone

`bonfire-date`, `bonfire-time`, `tripod-date` (thin wrappers over date-offset), the
`heroimage` shortcode wrapper, the hero's paypal button and `homeMessage`, and the font
`<link>`.

## From the consistency review 2026-03-28

| # | Where | Issue |
|---|---|---|
| B-04 | `tmpl/outputformat.html` | Deprecated `newScratch`. Fix with `slice` + `in`. |
| M-01 | `tk/help.html` | Hardcoded gallery content in a general helper. |
| M-04 | `tmpl/page-description.html` | `dbg-template` contaminates `<meta>` content. |
| M-05 | `tool/blog.html` | Bypasses `get-asset`, uses a raw resource. |
| M-14 | `tool/gallery-help.html` | Documents a `size` param; the real one is `mode`. |
| C-01 | various `tk/` | Inconsistent comment block style. |
| C-02 | `tool/block.html` | Mixed trimming, inline `$DBG` scaffold. |
| C-03 | `tool/item-group.html` | No trimming, no input docs. |
| C-04 | `tool/blog.html` | Dead variable initialisations before `range`. |
| C-05 | `tmpl/reading-time.html` | Wrong copy-pasted comment. |
| C-06 | `tool/feature-group.html` | `.blockClass` should be `$blockClass` in output. |
| C-07 | `tmpl/footer-left.html` | Extra `</small>`, empty `{{if}}`. |
| C-08 | `_markup/render-codeblock-mermaid.html` | `dbg-template` before mermaid output. |
| C-09 | `_markup/render-link.html` | `dbg-template` before every link render. |
| C-10 | www-mrmxf-com `gallery.html` | CSS class collision with the theme gallery. |
| C-11 | `tool/slideshow-help.html` | Documents `page` as required; it is not consumed. |
| C-12 | `tk/_help_common.html` | Empty file emitting `<style></style>`. |
