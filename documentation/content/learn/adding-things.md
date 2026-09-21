---
title:     Adding things
linkTitle: adding-things
date:      2026-03-30
summary:   'Page JavaScript, extensions and other per-page additions'
---

## page javascript

For a script needed by **one page**, list it in that page's frontmatter:

```yaml
params:
   script:
   - in:   assets
     file: js/three.js
   - in:   static
     file: js/weather.js
```

## site-wide javascript

For a script needed by **every page** — jQuery, analytics, a widget loader —
don't repeat the frontmatter on every page. Override the `hook/body-end`
hook in your own site instead:

```go-html-template
{{- /* layouts/_partials/hook/body-end.html */ -}}
{{- with resources.Get "js/jquery.min.js" -}}
  <script src="{{ .RelPermalink }}"></script>
{{- end }}
<script>
  $(function () { $("table").addClass("pi-table"); });
</script>
```

`hook/body-end` renders last inside `<body>`, after the theme's own scripts, so
the DOM is complete by the time your code runs. See
[the hooks reference]({{< ref "/hook" >}}) for the other five hook positions.

## mermaid

download your css & update `hook/head-end` — see
[the hooks reference]({{< ref "/hook" >}})
