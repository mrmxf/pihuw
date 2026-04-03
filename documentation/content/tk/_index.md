---
title:     Developer toolkit
linkTitle: tk
date:      2026-04-02
menus:     main
summary:   Value-returning and utility partials for theme developers. Not called from shortcodes.
---

The `tk/` partials are developer utilities. Most are **value-returning** — they
are called as `$result := partial "tk/name" .` and produce no HTML output.
They form the asset pipeline, debug tooling, and help system that all `tool/`
partials build on.

Content authors do not call these. Developers writing new `tool/` partials
should use them rather than calling Hugo functions directly, so that the
theme's conventions (image dict contract, opt validation, debug guards) are
consistently applied.

---

## Asset pipeline

These are the core image and asset resolution chain. Always call them in order
rather than calling `.Resources.Get`, `.Process`, or `.Fit` directly.

| Partial | Returns | Purpose |
|---|---|---|
| `get-asset.html` | `$img` dict | Resolves a path to a normalised `$img` dict (page resource / assets/ / static/) — gold standard |
| `img-process.html` | `$img` dict | Applies a Hugo process string or slice of strings to a resource; returns updated `$img` |
| `get-width-height.html` | `dict "w" int "h" int` | Parses a Hugo process string to extract target dimensions |
| `resource-image-featured.html` | `$img` dict or `0` | Resolves the featured image for a page using `get-asset` and `img-process` |
| `path-image-featured.html` | string | Returns the RelPermalink of the first resource matching `FeaturedGlob` |

The `$img` dict fields returned by `get-asset`:

| Field | Type | Notes |
|---|---|---|
| `src` | string | Relative permalink — always safe in `src=` |
| `res` | resource | Hugo resource object, or `0` for static fallback |
| `mediaType` | string | MIME type e.g. `image/svg+xml` |
| `isSvg` | bool | |
| `isRaster` | bool | png/jpg/webp/tiff/bmp — excludes gif |
| `isGif` | bool | May be animated — process with care |
| `isVideo` | bool | |
| `isImage` | bool | Convenience: `isSvg` or `isRaster` or `isGif` |
| `isStatic` | bool | From `static/` — no resource object, no processing possible |
| `width` | int | Native px width after any processing; 0 for SVG/video/static |
| `height` | int | Native px height |
| `alt` | string | Alt text; caller-supplied or basename of asset |
| `caption` | string | Caption text; `""` if not supplied |

## Site data utilities

| Partial | Returns | Purpose |
|---|---|---|
| `get-defaults.html` | map | Parsed `assets/data/defaults.yaml` — component default class names |
| `get-logo-path-string.html` | string | Site logo `src` path |

## Opt validation

| Partial | Returns | Purpose |
|---|---|---|
| `opt-validate.html` | dict | Parses and validates an opt JSON string against a schema string; returns `ok`, `opts`, `errors`, `errorMsg` |

See the [opt-validate reference](#opt-validate) below.

## Debug utilities

These emit output and are **not** value-returning. They must be guarded with
`{{- if hugo.IsServer -}}` and must **never** be called inside value-returning partials.

| Partial | Purpose |
|---|---|
| `dbg-template.html` | HTML comment showing the current template name — server only |
| `dbg-template-comment.html` | Alternate template comment emitter |
| `dbg.html` | Key-value debug panel rendered as a visible `<div>` — server only |
| `Debug.html` | Calls `hugo.Log "DEBUG"` — server only |
| `Debugf.html` | Formatted debug log — server only |
| `Warnf.html` | Formatted warning log — server only |
| `Errorf.html` | Formatted error log — server only |
| `templateList.html` | Returns the template hierarchy as a string — server only |
| `pageList.html` | Returns the page hierarchy as a string — server only |
| `kvListNoPage.html` | Returns context dict without page keys — server only |

## Help system

These build the inline help cards rendered by `help = "yes"` shortcodes.
Developers writing a new tool should create a peer `-help.html` file using
these partials.

| Partial | Purpose |
|---|---|
| `help.html` | Entry point for `{{&lt; hw t = "help" >}}` — calls all registered tool help partials |
| `help-tk.html` | Injects the CSS and JavaScript needed to show help modals |
| `help-card.html` | Wraps help content in a dismissible modal trigger |
| `help-header.html` | Renders the shortcode usage line and parameter summary |
| `help-description.html` | Renders the description and feature bullet list |
| `help-params.html` | Renders the parameter reference table |
| `help-examples.html` | Renders copy-pasteable code examples |
| `help-notes.html` | Renders notes, tips, and warnings |

Registering a new tool's help in `{{&lt; hw t = "help" >}}` requires adding its
name to the `$tools` slice in `tk/help.html`.

---

## opt-validate

`opt-validate` validates an `opt` JSON string from a shortcode against a
developer-supplied JSON schema string. It is called at the top of any
tool partial that accepts an `opt` parameter.

```html
{{- $v := partial "tk/opt-validate" (dict
    "schema" `{"mode!": "compact", "count": 0, "no-auto-tag": false}`
    "opt"    .opt
    "tool"   "my-tool") -}}
{{- if and (not $v.ok) hugo.IsServer -}}
  <div>{{ $v.errorMsg | safeHTML }}</div>
{{- end -}}
{{- $opts := $v.opts -}}
```

**Schema syntax:** keys ending in `!` are required; the value encodes the expected
type and default (`false`/`true` → bool, `0` → number, any string → string).

**Error IDs:** `SCHEMA` invalid schema · `JP` JSON parse failure ·
`FK:{key}` unknown key · `MK:{key}` missing required key · `TY:{key}` type mismatch

**Squashing errors:** add `"squash": "FK:foo MK:bar"` to the opt string to suppress
specific error IDs. Use `"squash": "*"` (hero mode) to suppress all errors during
schema development — a loud warning banner is shown in server mode and it must be
removed before publishing.
