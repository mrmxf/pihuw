# PiHuW — Claude Code Guide

## Project Identity

```yaml
project:
  name: PiHuW (Pi Hugo Web)
  purpose: >
    A lightweight, functional Hugo theme built on PicnicCSS.
    Designed for resource-constrained environments (Raspberry Pi, ESP32)
    and for content authors who should not need to understand Hugo internals.
  principles:
    - Minimalism: small footprint, no CDNs by default
    - Simplicity: easy to understand, use, and modify
    - Hugo Native: leverage Hugo built-ins; no external toolchains
    - Low cognitive load: content authors interact only with frontmatter and
      shortcode params — never with Hugo process strings or template internals
```

---

## Architecture

```yaml
structure:
  layouts/:
    baseof.html / home.html / list.html / single.html: Top-level page templates
    _partials/:   All reusable partial templates (underscore prefix is intentional)
      tk/:     Toolkit partials — asset resolution, image processing, debug utils
      tmpl/:      Layout partials — head, nav, footer, taxonomies, pagination
      tool/:      Component partials — each maps to a {{< hw t="..." >}} shortcode type
    _shortcodes/: Shortcode entry points (thin wrappers that delegate to tool/ partials)
    _markup/:     Render hooks (links, codeblocks)
  assets/:
    css/:         SASS source files
    data/defaults.yaml: Central source for all component default class names and settings
  config/_default/:
    hugo.yaml:    Site config
    params.yaml:  Theme params (ui, extensions, bio defaults, etc.)
    module.yaml:  Hugo module config and mounts
```

### Partial naming conventions

| Directory | Purpose | Called by |
|-----------|---------|-----------|
| `tk/`  | Return-value toolkit: asset resolution, processing, debug | other partials |
| `tmpl/`   | Layout building blocks: head, nav, footer, SEO | base templates |
| `tool/`   | Renderable components one-to-one with shortcode types | `_shortcodes/hw.html` |
| `tool/*-help.html` | Inline documentation for each tool | `tk/help.html` |

---

## The `$img` dict — pattern-2 image contract

All image-aware partials pass images as a normalised `$img` dict. Never pass raw
Hugo resource objects or plain path strings between partials.

```yaml
$img fields (from tk/get-asset):
  src:       string   # relative permalink, always safe in src=
  res:       resource # Hugo resource object, or 0 for static fallback
  mediaType: string   # MIME type e.g. "image/svg+xml"
  isSvg:     bool
  isRaster:  bool     # png/jpg/webp/tiff/bmp — excludes gif
  isGif:     bool     # may be animated — process with care
  isVideo:   bool
  isImage:   bool     # convenience: isSvg or isRaster or isGif
  isStatic:  bool     # from static/, no resource object, no processing possible
  width:     int      # native px width after any process; 0 for SVG/video/static
  height:    int      # native px height
  alt:       string   # alt text; caller-supplied or basename of asset
  caption:   string   # caption text; "" (falsy) if not supplied
  dbg:       string   # accumulated debug log; false if not supplied
```

Image pipeline:
  1. `tk/get-asset`    — resolves path → $img dict
  2. `tk/img-process`  — applies processing string(s) → updated $img dict
  3. `tool/thumb`         — generates thumbnail → updated $img dict (thumbWidth/thumbHeight)

---

## Coding Rules (in precedence order)

### 1 — Hugo official best practices (highest precedence)

- Use `partial` not `template` for all partial calls.
- Always pass a dict as the partial's dot (`.`), never a bare page object.
- Use `.Store` not `.Scratch` (`.Scratch` removed in Hugo ≥ 0.148).
- Use `try (resources.Get ...)` for fallible resource lookups.
- All whitespace-sensitive partials use `{{- -}}` trimming on every action.

### 2 — Value-returning partial rules (CRITICAL)

A **value-returning partial** is any partial called as `$x := partial "..." .`.

**RULE: A value-returning partial MUST produce zero text output.**
Any rendered text — including HTML comments, whitespace, or debug output — in the
template buffer silently discards the return value. The caller receives an empty
string instead of the intended dict/string/int.

Consequences:
- `{{partial "tk/dbg-template" .}}` MUST NOT appear in any value-returning partial.
  Add this comment to the partial's comment block to warn future editors:
  `DO NOT call partial "tk/dbg-template" - it prevents return from working.`
- Every action in a value-returning partial uses `{{- -}}` trimming (both sides).
- No raw text, no blank lines between actions that lack surrounding `{{- -}}` trims.

**RULE: Single return at the bottom.**
```html
{{- $ret := 0 -}}            ← initialise with the falsy/default value
... assign $ret via if/with/range blocks ...
{{- return $ret -}}           ← single return, always the last line
```
Do NOT use early-exit multiple `return` statements. The single-return pattern
makes it obvious what the partial produces and prevents partial-output contamination.

Reference implementations (gold standard):
- `tk/get-asset.html`   — dict return, full input/output docs
- `tk/img-process.html` — single return, reflect.IsSlice, merge pattern
- `tool/thumb.html`        — single return with $ret := 0

### 3 — Comment block standard

Every partial opens with a comment block documenting:
```
{{- /*
  path/partial-name
  One-line description.

  .param1  — type    — description (required)
  .param2  — type    — description (optional; defaults to X)

  returns (type — description)

  DO NOT call partial "tk/dbg-template" - it prevents return from working.
*/ -}}
```
For output-only (non-value-returning) partials, omit the `returns` and
`DO NOT call` lines.

### 4 — Low cognitive load for content authors

Content authors write YAML frontmatter and shortcode attributes.
They must never need to:
- Write Hugo image process strings (`resize x100`, `fit 200x200`)
- Know the difference between `res`, `src`, or `$img` dict fields
- Understand partial call chains or the `$img` pipeline

Provide sensible defaults in `params.yaml` for all sizing/processing decisions.
Accept human-friendly aliases (`size: "small"` not `process: "resize x80"`).
Document shortcode params in the corresponding `-help.html` file with
copy-pasteable frontmatter examples.

### 5 — Consistency rules for tool/ partials

- Use `tk/get-asset` to resolve all image/asset paths — never call
  `.Resources.Get`, `.Resources.Match`, or `.GetMatch` directly in a tool partial.
- Use `tk/img-process` for image transformations — never call `.Process`
  or `.Fit` directly in a tool partial.
- Use `tk/resource-image-featured` for featured-image resolution.
- Pass `.page` (lowercase) in dicts, not `.Page` — the lowercase form allows
  both page-bundle and shortcode contexts without special-casing.

### 6 — Debug tooling rules

`tk/dbg-template` outputs an HTML comment with the current template name.
It is ONLY safe in output-generating (non-value-returning) partials and
ONLY when wrapped in `{{- if hugo.IsServer -}}...{{- end -}}`.

`tk/dbg.html` and `tool/dbg.html` are the correct way to surface debug
key-value data. They are server-only and produce nothing in production.

Never use `$DBG := false` as a dead variable — either wire it up or remove it.

---

## Partial catalogue

### tk/ — toolkit (value-returning)

| Partial | Returns | Notes |
|---------|---------|-------|
| `get-asset` | `$img` dict | Gold standard — resolves page resource / assets/ / static/ |
| `img-process` | updated `$img` dict | Applies string or slice of process strings in sequence |
| `get-width-height` | `dict "w" int "h" int` | Parses Hugo process string for dimensions |
| `get-logo-path-string` | string | Site logo src path |
| `get-defaults` | map | Parsed `assets/data/defaults.yaml` |
| `resource-image-featured` | `$img` dict or 0 | Featured image for a page (uses get-asset + img-process) |
| `path-image-featured` | string | RelPermalink of first resource matching FeaturedGlob |
| `templateList` | string | Template hierarchy (server-only debug) |
| `pageList` | string | Page hierarchy (server-only debug) |
| `kvListNoPage` | dict | Context kv without page keys (server-only debug) |

### tk/ — output-generating

| Partial | Purpose |
|---------|---------|
| `dbg-template` | HTML comment with template name — server-only, NOT in value-returning partials |
| `dbg.html` | Key-value debug panel — server-only |
| `help.html` | Renders help index for `t="help"` |
| `help-card.html` | Wraps help content in modal trigger |
| `help-tk.html` | Injects help modal CSS/JS |
| `help-params.html` | Parameter table within help modal |
| `help-examples.html` | Code examples within help modal |
| `help-notes.html` | Warnings/notes within help modal |
| `help-card.html` | Modal trigger wrapper |

### tool/ — components

Each `tool/X.html` maps to `{{&lt; hw t="X" ... >}}`.
Each has a peer `tool/X-help.html` documenting its params.

Core image/media components: `thumb`, `image`, `image-featured`, `media`, `gallery`,
`slideshow`, `cover`, `banner`.

Layout components: `block`, `feature`, `feature-group`, `item`, `item-group`,
`item-group-blog`, `accordion`, `acc-tab`.

Content utilities: `blog`, `children`, `caption`, `md-param`, `include`,
`env`, `fetch`, `page-date`, `tooltip`, `typist`, `smschat`.

Table components: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`,
`trtd`, `trth`, `col`, `colgroup`.

---

## Customisation

```yaml
primary:   Override assets/data/defaults.yaml in the consumer site.
secondary: Page frontmatter params (bodyClass, FeaturedGlob, FeaturedWxH, etc.)
tertiary:  Site params in config/_default/params.yaml (ui, extensions, bio, etc.)
```

Do not fork or copy theme partials — override them by placing an identically
named file in the consumer site's `layouts/` tree.

---

## Documentation Content Structure

The `documentation/content/` tree has a **one-to-one mapping** with `layouts/`:

| Content section          | Mirrors                       | Audience            |
|--------------------------|-------------------------------|---------------------|
| `content/shortcodes/`    | `layouts/_shortcodes/`        | Authors             |
| `content/tool/`          | `layouts/_partials/tool/`     | Authors             |
| `content/tmpl/`          | `layouts/_partials/tmpl/`     | Developers          |
| `content/tk/`            | `layouts/_partials/tk/`       | Developers          |
| `content/kitchen_sink/`  | n/a                           | Authors (live examples)  |

### Maintenance rules

**Adding a new `tool/` partial:**

1. Create `layouts/_partials/tool/X.html`
2. Create `layouts/_partials/tool/X-help.html` (follow existing help pattern)
3. Add `"X"` to the `$tools` slice in `layouts/_partials/tk/help.html`
4. Create `documentation/content/tool/X.md` containing only frontmatter + `{{&lt; hw t="X" help="yes" >}}`
5. Create `documentation/content/kitchen_sink/X.md` with a live example

**Adding a new `tmpl/` or `tk/` partial:**

1. Create the partial
2. Add a row to the relevant table in `documentation/content/tmpl/_index.md` or `documentation/content/tk/_index.md`

**Deliberately excluded from author-facing docs (`t="help"` index):**

- All `tk/` partials — developer use only
- `tk/opt-validate` — documented in `content/tk/_index.md` only

### tool/ dogfood pattern

Each `content/tool/X.md` page renders its own help card inline:

```markdown
---
title:     X
linkTitle: X
date:      2026-04-02
summary:   One-line description shown in the tool/ index listing.
---

{{</* hw t="X" help="yes" */>}}
```

The `content/tool/_index.md` uses `{{&lt; hw t="item-group-by-type" count=100 >}}`
to auto-list all tool pages as item cards — no manual index maintenance needed.

---

## Known issues backlog (from consistency review 2026-03-28)

Severity key: B = blocking (incorrect output), M = moderate (debt), C = cosmetic

```
B-04  tmpl/outputformat.html          — deprecated newScratch (fix: use slice + in)
M-01  tk/help.html                 — hardcoded gallery content in general helper
M-04  tmpl/page-description.html      — dbg-template contaminates <meta> content
M-05  tool/blog.html                  — bypasses get-asset, raw resource
M-14  tool/gallery-help.html          — documents "size" param, actual param is "mode"
C-01  Various tk/                  — inconsistent comment block style
C-02  tool/block.html                 — mixed trimming, inline $DBG scaffold
C-03  tool/item-group.html            — no trimming, no input docs
C-04  tool/blog.html                  — dead variable initialisations before range
C-05  tmpl/reading-time.html          — wrong copy-pasted comment
C-06  tool/feature-group.html         — .blockClass not $blockClass in output
C-07  tmpl/footer-left.html           — extra </small>, empty {{if}} block
C-08  _markup/render-codeblock-mermaid.html — dbg-template before mermaid output
C-09  _markup/render-link.html        — dbg-template before every link render
C-10  www-mrmxf-com gallery.html      — CSS class collision with theme gallery
C-11  tool/slideshow-help.html        — documents "page" as required when not consumed
C-12  tk/_help_common.html         — empty file emitting <style></style>
```
