# claude-backlog.md — known issues

Not read every query. Read it before touching a listed file, or when picking up debt work.

Severity: **B** blocking / incorrect output · **M** moderate debt · **C** cosmetic

## Found 2026-09-12

| # | Where | Issue |
|---|---|---|
| B-05 | `.clog.yaml:47` | `BUILD_DIR="public"` but `hugo.yaml` sets `publishDir: kodata`. The `cd public` fails, so deploy is broken. |
| ~~B-06~~ | `.github/workflows/gh-static.yml` | FIXED 2026-09-21 — `HUGO_VERSION` now 0.166.0, matching `module.yaml` min. |
| M-15 | `tk/get-asset-help.html` | Documents `tool/thumb`, `tool/img` and `tool/srcset`. None exist. The old CLAUDE.md called `tool/thumb` a gold-standard reference. |
| C-13 | `.clog.yaml:128` | `[ -f hugo .yaml ]` — stray space, so the test never matches. |
| C-14 | `.clog.yaml:113` | `suffix:` snippet has an unbalanced trailing `"`. |
| C-15 | `.clog.yaml:119` | `project has fomantic` cats `layouts/_partials/tmpl/head-cdn`, which no longer exists. The check always fails. |
| B-10 | `_shortcodes/hw.html:46` | `count` defaults to 1 for EVERY tool, so a tool cannot tell "no count" from `count="1"`. `item-socials` has to treat 1 as no cap. |
| C-16 | `_partials/hw.html:12,36` | The `found at` debug comment is emitted twice per call and is not guarded by `hugo.IsServer`, so it ships in production builds. |
| C-17 | `documentation/content/kitchen_sink/gallery.md:12` | `{{ < hw t = "gallery" from = "/rc" />}}` has spaces, so it renders as literal text. The gallery example has never run. |
| C-18 | `tool/gallery.html` | `from` is a FRONTMATTER PARAM NAME, not a path, but `gallery.md` passes `/rc` as though it were a folder. |
| B-11 | `page-title.html` + `tool/cover.html` | v0.4.6 made page-title a `<p>`, so only `cover` supplies an `h1`. A page with no cover has none. Decided: cover owns it. |

## Found 2026-09-21

| # | Where | Issue |
|---|---|---|
| B-12 | `.clog.yaml:33` | `bc-releases-yaml` reads `clogrc/clog.yaml`, which this repo does not have. It returns empty, so `clog git tag ref` yields a bare `v` and every build-control snippet that depends on it is inert. Blocks adopting the clog build pattern. |
| B-13 | `.clog.yaml:106` + `data/releases.yaml` | `git tag ref` is `echo "v$(yq '.[0].version')"` but versions are already stored WITH the `v` (`"v0.4.9"`), so it would emit `vv0.4.9`. `refgo` adds a third. clog's own repo has the same defect. |
| C-19 | `documentation/content/kitchen_sink/graph.md:12` | The bar-chart example passes inline `x`/`y` with no `from`, and `tool/graph` reports "no data source". Pre-dates v0.4.9; the kitchen-sink graph has never rendered. |

## Documentation gaps — found 2026-09-21

Both are M. Neither blocks a build; both cost every new consumer the same hour.

### M-21 — no "Customising the theme" section

`documentation/content/learn/` has `styling.md` (four lines on `site.css`), `css.md`
(tokens and the CSS bundle), `params.md` and `adding-things.md`. There is no page that
explains *how the theme is designed to be bent*, so a consumer reads four part-pages and
infers the model. The reasoning exists only in `claude-human-narrative.md`, which is an
internal file consumers never see.

Wanted: a distinct top-level docs section, not another `learn/` leaf.

- **Design intent** — the two audiences (author vs integrator), why forking is not on the
  customisation list, why hooks are empty by contract. Port the public half of
  `claude-human-narrative.md`; it is written for people already.
- **The override ladder**, one page, in preference order: `defaults.yaml` → frontmatter →
  `params.yaml` → `site.css` → replace one `assets/css/pihuw/*.css` → override a partial.
  Each rung needs a worked example and a note on what it costs at upgrade time.
- **Reference pages for the things people actually reach for.** These do not exist anywhere:
  - CSS custom properties — one table per group (`--hi*`, `--bg*`, `--pi-*`, the `1c`
    component tokens), with the light and dark value of each and what reads it. `css.md`
    has some of this but it is organised by source file, not by what a user wants to change.
  - Animation — `90-animation.css` ships `@keyframes bounce`, `hue-rotate` and the
    `.view-s/m/w` responsive classes. Nothing documents them; they are discoverable only
    by reading the CSS.
  - Dark mode — the tri-state contract (system / forced-light / forced-dark), and the rule
    that both dark blocks must be edited together. Currently a comment in `05-theme-dark.css`.
  - Fonts and typography tokens, and the Google Fonts `@import` route.

Watch for: `learn/css.md` and `learn/styling.md` already overlap. Fold, do not add a third.

### M-22 — no docs on building the theme

Nothing in `documentation/content/` says how to build. `README.md` now covers the clone,
symlink and `hugo server`, and `claude-build.md` has the full picture, but that file is
internal and reads as notes-to-self. A consumer wanting to build the docs site, or a
contributor wanting to develop against a local checkout, has nowhere to look.

Wanted: a docs section covering both routes.

- **Manually** — Hugo extended >= 0.166.0, and *why* extended (WebP encoding, not SASS:
  people keep assuming SASS and relaxing the requirement). The `content/` symlink and why
  it is not committed. `hugo --quiet` must exit 0. `publishDir: kodata`, not `public`,
  and that its output is committed.
- **With clog** — `clog watch`, `clog Check build`, `clog github-page`. What each does, and
  that `clog watch` manages the symlink itself so it should not be created by hand.
- **Developing against a local checkout** — the `replacements:` line in a consumer's
  `module.yaml`, and the warning that it must be commented out before `hugo mod vendor`.
  This is in `claude-build.md` and is exactly the kind of thing a consumer gets wrong.

Both routes need the same caveat: there is no npm, no SASS and no PostCSS step. Say so
explicitly, because the repo carried `postcss.config.js` and `.nvmrc` until 2026-09-21 and
the muscle memory will outlive them.

## FIXED 2026-09-12 — v0.4.8, found retiring chiddingfold's overrides

- **get-asset `noPublish` emptied `src` for every resource**, not just rasters. An SVG,
  GIF or video has no processed copy to link instead, so callers got `src=""`: a cover
  with an SVG or video rendered no media, and chiddingfold's four SVG sponsor logos would
  have gone blank. Now `and .noPublish $isRaster` gates the `RelPermalink` read.
- **`lang=` and `og:locale` used `site.Language.Lang`**, which is `en` on a site that sets
  `locale: en-GB`. `baseof.html`, `blog/section.html` and `tmpl/head-seo.html` now read
  `site.Language.Locale | default site.Language.Lang`.
- **cover discarded `alt=""`**: it passed `""` to get-asset, whose `default` turned it into
  the basename, so a decorative cover announced `hero.jpg`. cover now emits its own `$alt`.
- **cover gained `subtitle`, `inner`, `innerHTML` and `class`**. `inner` is markdownified
  (the hw convention); `innerHTML` is verbatim, for partials that pass rendered markup.
  Site CSS restyling a cover must use `.pi-cover.x`: cover's `<style>` sits in `<body>`,
  after site.css, and wins at equal specificity.
- **hw never passed `height`**, so cover's documented `height` param was dead via the
  shortcode. hw now passes `height` and `subtitle`.

Verified: SVG page-bundle cover emits a real `src` and `alt=""`; subtitle `<sup>`
survives; chiddingfold builds with an identical published file list (bar site.css's hash)
and exactly one canonical, og:title and h1 per page.

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

## FIXED 2026-09-12 — B-08, get-asset published every original it was asked about

`tk/get-asset.html` ended with an unconditional `$src = $res.RelPermalink`. In Hugo, reading
`.RelPermalink` is what WRITES the resource, so merely asking about an image published the
full-size original — even when the caller only ever used a resized copy.

`tool/gallery.html` was the one in-theme offender: it resolved each image, then built a
300x300 proxy and a 1920 full copy with `tk/img-process` and linked only those two. The
original shipped and nothing referenced it.

Measured on a two-image gallery: **368,622 bytes of unlinked originals**, alongside the four
variants actually linked. Chiddingfold reported ~8 MB from the same cause.

Three changes:

- `get-asset` takes `.noPublish` (default false). When set, the `RelPermalink` read is
  skipped and `src` comes back empty. `.Width`/`.Height` are still read — those are metadata
  and never publish.
- `img-process` gated on `$img.src`, which made an empty-src dict unprocessable and would
  have silently returned 0. It now gates on `or $img.res $img.src`: `src` is irrelevant to
  processing, `res` is what it needs.
- `tool/gallery.html` passes `noPublish true`.

The default is unchanged, so nothing breaks for the six consumers. Callers that legitimately
use `$img.src` — `banner`, `image`, `slideshow-static` — are untouched.

Verified by diffing the full published file list with and without the fix: exactly the two
originals disappear and no other file is lost.

## FIXED 2026-09-12 — M-16 and M-18, adopted from chiddingfoldbonfire

`tk/date-offset.html` — offset a time by `1w`/`5w-1d`/`3h5m` and format it, with an
`ordinal` format. Taken as-is; only the bonfire-specific comments were generalised. Keep the
w/d-via-AddDate split: `time.ParseDuration` rejects `1w` and `1d`, and AddDate stays
calendar-correct across DST.

Verified: `1w`, `5w-1d`, `3h5m`, `15m`, `minus`, every ordinal suffix including 11/12/13th
and 21st/22nd, and a 1w offset across the UK October clock change which keeps 19:00 at 19:00.

`tmpl/head-seo.html` — canonical URL, Open Graph and Twitter cards, called from
`tmpl/head.html` just before the `hook/head-end` hook so a site can still add or override.
New params: `social.twitter`, `ogImage`, and `ui.hide.seo` to suppress the lot.

The card image comes from the page's `image` param or `ogImage`, processed to 1200px jpg, and
uses `.Permalink` because og:image must be absolute. With no usable raster the card degrades
to `summary` rather than emitting a broken `og:image`. An empty description omits the tag
instead of emitting an empty one.

Verified with `--baseURL https://example.com/`: canonical and og:url absolute, og:image
1200x800 with `summary_large_image`, and only the processed card is published — the 2400px
original stays out, which is the B-08 fix doing its job.

Note the theme's own docs site sets no `baseURL`, so canonical renders as `/` there. That is
correct for a consumer site and expected here.

## FIXED 2026-09-12 — B-09 and M-20, cover and item-socials

`tool/cover.html` emitted `html, body { height: 100% }` and four more rules as raw text with
no `<style>` wrapper, so the CSS rendered as visible text and, had it applied, would have
hijacked the page. It also hardcoded a second `<section>` containing a `<video>` pointing at
the image's own `src`, and ignored `header`, `text` and `link` entirely — which the
kitchen-sink example passes and the summary promises.

Rewritten as the documented component: a full-bleed band with an image or video behind an
overlaid heading and text. Scoped CSS in a real `<style>`, emitted once per page via a Store
flag. srcset at 640/1024/1600/2000 capped at the source's native width, WebP, and `noPublish`
so the original never ships. `min-height` uses `svh` so the band does not jump as a mobile
URL bar hides. Emits an `h2`: `tmpl/page-title.html` already owns the page's `h1`.

`tool/item-socials.html` was 166 bytes that rendered nothing. Implemented as a row of FA6
brand icons driven by a new `site.Params.social` map, with `from` tokens
(`instagram-mrmxf`), `skip`, and a `count` cap. Email renders `mailto:` and correctly omits
`target="_blank"`; a handle starting with `http` is used verbatim, which is the escape hatch
for LinkedIn company pages.

Verified: default order, explicit tokens, inline handle override including a hyphenated
handle, skip, cap, mailto, and the full-URL escape hatch.

Both help files were wrong and have been rewritten. `cover-help.html` was a **copy of
`item-include`'s help** — it documented a `from` param, page metadata extraction and reading
times, none of which cover has ever had.

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

FIXED 2026-09-12 — `get-asset` takes `.noPublish`, `img-process` no longer gates on `.src`,
and `tool/gallery` opts in. See the FIXED section above. chiddingfold removed its `tk/img.html`,
`tk/date-offset.html` and SEO head meta against v0.4.8, and rebuilt its hero on `tool/cover`.

### Generic code to adopt

| # | From | Work |
|---|---|---|
| M-17 | `_markup/render-image.html` | No image render hook in the theme, so a plain `![alt](img/x.jpg)` ships full size. This emits resized WebP with srcset and lazy loading. Depends on B-08. |
| M-19 | `hook/body-end.html` | Consent-gated analytics. The theme offers nothing, so the obvious thing is unconditional GA — a UK PECR problem. Take the mechanism, leave the banner copy. |

### Theme bugs these overrides route around

Both FIXED 2026-09-12 — see the FIXED sections above.

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
