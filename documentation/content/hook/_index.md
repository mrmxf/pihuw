---
title:     Layout hooks
linkTitle: hook
date:      2026-08-11
menus:     main
summary:   Six empty partials PiHuW calls from fixed positions on every page. Override them in your own site to add site-wide furniture, CSS, or JavaScript.
---

Hooks are the sanctioned way to add your own markup to **every page** of a PiHuW
site without forking the theme. PiHuW calls six empty partials from fixed
positions in the page. The theme's copies produce nothing; you supply content by
creating a file with the same name in your own site.

They are the one partial folder a site integrator is expected to write into —
`tk/`, `tmpl/`, and `tool/` are theme internals.

> **These are not render hooks.** They are *layout* hooks. Hugo's *render* hooks
> (`layouts/_markup/render-link.html` and friends) are a different mechanism that
> transforms markdown as it is converted to HTML.

---

## The six hooks

| Partial | Fires |
|---|---|
| `hook/head-begin` | First thing inside `<head>`, before charset and viewport |
| `hook/head-end` | Last thing inside `<head>`, after the theme CSS and JS |
| `hook/body-begin` | First thing inside `<body>`, before `<header>` |
| `hook/main-begin` | Inside `<main>`, before the page content |
| `hook/main-end` | Inside `<main>`, after the page content |
| `hook/body-end` | Last thing inside `<body>`, after `tmpl/body-scripts` |

`main` means the content column, not the whole page. `main-begin` sits *below*
the navbar and breadcrumbs; `main-end` sits *above* the footer. To place
something outside the content column, use the `body-*` pair.

Roughly, where they land in the rendered page:

```html
<head>
  ← hook/head-begin
  ... theme meta, title, CSS, JS ...
  ← hook/head-end
</head>
<body>
  ← hook/body-begin
  <header> navbar, breadcrumbs </header>
    <main>
      ← hook/main-begin
      ... your page content ...
      ← hook/main-end
    </main>
  <footer> ... </footer>
  ... theme scripts ...
  ← hook/body-end
</body>
```

---

## The PiHuW guarantee

**Every partial in `hook/` is inert.** No PiHuW feature depends on any of them,
and none of them contributes anything to a production build. They exist solely
as blank templates for you to inject your own functionality into. You can fill
any of the six without wondering what theme behaviour you might be displacing —
the answer is always none.

The one exception to "blank": under `hugo server` each hook emits a single HTML
comment naming the template, as a debug aid. A production build emits nothing.

This guarantee covers PiHuW's own behaviour only. It says nothing about
*precedence* when other themes are in play — see
[multi-theme sites](#multi-theme-sites) below.

## How to use a hook

Create the identically named file in **your** site's layouts tree:

```txt
your-site/
  layouts/
    _partials/
      hook/
        body-end.html      ← your file wins over the theme's empty one
```

You can copy the theme's whole `layouts/_partials/hook/` folder in one go — every
file is inert, so nothing changes until you start editing them, and the comment
block in each file tells you where it fires.

### Copy what you need — then delete the rest

**Keep only the hooks you have actually filled in.**

An empty file is not the same as no file. Hugo resolves `hook/body-begin` to
exactly one partial: your project's copy beats every theme's, and themes are
consulted in the order they are declared. An empty override therefore still
*wins* that lookup and silently stops anything below it from rendering.

On a single-theme PiHuW site that costs you nothing today. It costs you later if
PiHuW ever ships a default in a hook, and it costs you immediately on a
multi-theme site.

Do not edit the theme's copies. PiHuW is a Hugo module and your edits would be
lost on the next `hugo mod get -u`.

A hook fires on **every page of the site**, so it is the right tool for
site-wide furniture and the wrong tool for one-page tweaks — use page
frontmatter or a shortcode for those.

### If your hook does not appear

Hugo does not warn about a misplaced override; it silently falls back to the
theme's empty partial and the page builds cleanly. Check the path is exactly
`layouts/_partials/hook/<name>.html` — note the plural `_partials` and the
leading underscore.

---

## Which hook to pick

| You want to add | Use |
|---|---|
| A stylesheet that must override theme CSS | `hook/head-end` |
| Extra `<meta>`, `<link>`, or a web font | `hook/head-end` |
| Site-wide JavaScript, analytics, jQuery | `hook/body-end` |
| A skip-to-content link or banner above the nav | `hook/body-begin` |
| An announcement strip inside the content column | `hook/main-begin` |
| Share buttons or a comment widget below the content | `hook/main-end` |

---

## Example — jQuery on every page

Put jQuery in your site's `assets/js/`, then create
`layouts/_partials/hook/body-end.html`:

```go-html-template
{{- /* layouts/_partials/hook/body-end.html — in YOUR site, not the theme */ -}}
{{- with resources.Get "js/jquery.min.js" -}}
  <script src="{{ .RelPermalink }}"></script>
{{- end }}
<script>
  $(function () {
    $("table").addClass("pi-table");
  });
</script>
```

Use `hook/body-end` rather than `hook/head-end` for this. It renders *after*
`tmpl/body-scripts`, so the whole DOM and the theme's own JavaScript are already
in place — the script runs against a complete page without needing `defer` or a
`DOMContentLoaded` wrapper.

---

## Multi-theme sites

PiHuW guarantees its own hooks are never active. It cannot guarantee anything
about **precedence**, because precedence is a property of your site's module
configuration, not of the theme.

If you combine PiHuW with another theme or module that also ships
`_partials/hook/*.html`, only one copy of each name renders. Which one depends
on the order of your `imports` in `config/_default/module.yaml`. PiHuW's inert
copy may end up shadowing the other theme's working one — and because the
shadowed partial simply does not run, the build succeeds and nothing warns you.

Arbitrating between two themes that want the same hook is **outside the scope of
PiHuW**. If you hit it, take control in your own project layouts, where you
outrank both themes, and call each theme's partial explicitly:

```go-html-template
{{- /* layouts/_partials/hook/body-end.html — in YOUR site */ -}}
{{- partial "hook/body-end-from-other-theme" . -}}
<script>/* your own additions */</script>
```

Renaming the other theme's partial to a name PiHuW does not use is usually the
simplest fix. If neither theme's hook set can be renamed, you are past what a
name-based override system can express — consider mounting one theme's layouts
under a distinct target in `module.yaml`.

---

## Adding a hook call to a base template

If you write your own base template that emits its own `<html>`/`<body>`, it
must call all six hooks itself. In PiHuW that is `layouts/baseof.html` and
`layouts/blog/section.html`; the head pair is inherited via `tmpl/head.html`.

Templates that only `{{ define "main" }}` — `404.html`, `single.html`,
`list.html` — must **not** call the hooks. They inherit them from `baseof.html`,
and calling them again would fire each hook twice on those pages.

---

## Migration

### From `my/head-begin` and `my/head-end`

Earlier PiHuW versions checked `templates.Exists "_partials/my/head-begin.html"`
and called `my/head-begin` / `my/head-end` if the consumer site had created
them. **Those are no longer called.**

| Old | New |
|---|---|
| `layouts/_partials/my/head-begin.html` | `layouts/_partials/hook/head-begin.html` |
| `layouts/_partials/my/head-end.html` | `layouts/_partials/hook/head-end.html` |

### From `tk/hook-*`

A pre-release iteration put the hooks in `tk/` with a `hook-` filename prefix.
If you tried those, move them:

| Old | New |
|---|---|
| `_partials/tk/hook-head-begin.html` | `_partials/hook/head-begin.html` |
| `_partials/tk/hook-head-end.html` | `_partials/hook/head-end.html` |
| `_partials/tk/hook-body-begin.html` | `_partials/hook/body-begin.html` |
| `_partials/tk/hook-main-start.html` | `_partials/hook/main-begin.html` |
| `_partials/tk/hook-main-end.html` | `_partials/hook/main-end.html` |
| `_partials/tk/hook-body-end.html` | `_partials/hook/body-end.html` |

Contents move across unchanged — only the path and filename differ. Note that
`main-start` is now `main-begin`, so all six are `begin`/`end` pairs.
