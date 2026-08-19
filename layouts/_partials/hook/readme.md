# `hook` — layout hooks

Six empty partials that PiHuW calls from fixed positions on **every page**.
The theme's copies emit nothing. You add site-wide content by creating a file
with the same name in your own site's `layouts/_partials/hook/` folder.

These are *layout* hooks. They are unrelated to Hugo's *render* hooks
(`layouts/_markup/render-link.html` and friends), which act on markdown.

| Partial | Fires |
|---|---|
| `head-begin.html` | First thing inside `<head>`, before charset and viewport |
| `head-end.html`   | Last thing inside `<head>`, after the theme CSS and JS |
| `body-begin.html` | First thing inside `<body>`, before `<header>` |
| `main-begin.html` | Inside `<main>`, before the page content |
| `main-end.html`   | Inside `<main>`, after the page content |
| `body-end.html`   | Last thing inside `<body>`, after `tmpl/body-scripts` |

`main` is the content column, not the whole page — `main-begin` sits below the
navbar and breadcrumbs, `main-end` sits above the footer.

## The PiHuW guarantee

Every partial in this folder is **inert**. No PiHuW feature depends on any of
them, and none of them contributes anything to a production build. They exist
solely as blank templates for you to inject your own functionality into.

The one exception to "blank": under `hugo server` each emits a single HTML
comment naming the template, as a debug aid. Production output is empty.

## Copy what you need

Copy this whole folder into your site, or copy just the one file you need.
Either way, **keep only the hooks you have actually filled in, and delete the
rest.**

An empty file is not the same as no file. Hugo resolves `hook/body-begin` to
exactly one partial — your project's copy beats every theme's, and themes are
consulted in the order they are declared. An empty override therefore still
*wins* the lookup and silently stops anything below it from rendering. On a
single-theme PiHuW site that costs you nothing today, but it would suppress any
default PiHuW ships in a hook later, and on a multi-theme site it can suppress
another theme's hook of the same name.

Do not edit the theme's copies. PiHuW is a Hugo module and your edits are lost
on the next `hugo mod get -u`.

Hugo does not warn about a misplaced override — it silently falls back to the
theme's empty partial. If your hook content does not appear, check the path is
exactly `layouts/_partials/hook/<name>.html`.

## Multi-theme sites

PiHuW guarantees only its own behaviour: its `hook/` partials are never active.
It cannot guarantee anything about *precedence*. If you combine PiHuW with
another theme or module that also ships `_partials/hook/*.html`, only one copy
of each name renders, and which one depends on your module import order. PiHuW's
empty copy could shadow the other theme's working one.

Resolving that is outside PiHuW's scope. If you hit it, override the hook in
your own project layouts and call both themes' partials explicitly by path.

Full reference with examples: `documentation/content/hook/_index.md`.
