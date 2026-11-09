---
title:     noindex example
linkTitle: noindex
date:      2026-11-09
noindex:   true
summary:   A page with noindex set — its robots meta says noindex and it is missing from sitemap.xml.
---

This page sets `noindex: true` in its front matter. View the page source: the
`<head>` contains

```html
<meta name="robots" content="noindex, nofollow">
```

and `/sitemap.xml` does not list this page. It still appears in the `tmpl` section
list, because `noindex` only talks to search engines. Add `build: {list: never}`
as well to take it out of the site's own lists. See [Layout templates][tmpl].

[tmpl]: /tmpl/
