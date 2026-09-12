---
title:     mermaid
linkTitle: mermaid
date:      2026-09-12
summary:   Mermaid diagrams from a fenced code block — no configuration required.
---

Fence a diagram with `mermaid` and it renders. The library loads only on pages that
contain one, and follows the theme toggle.

```mermaid
graph LR
  A[content.md] -->|fenced diagram| B(render-codeblock-mermaid)
  B --> C[pre.mermaid]
  B -->|Store.Set hasMermaid| D(tmpl/body-scripts)
  D -->|end of body| E[mermaid.min.js]
  E --> F([SVG diagram])
```

A second diagram on the same page shares the one library load.

```mermaid
sequenceDiagram
  Author->>Hugo: fenced diagram
  Hugo->>Browser: pre.mermaid + loader
  Browser->>Browser: mermaid.run()
```

## Opting out

`mermaid.enable: false` in `params.yaml` suppresses the loader.
`mermaid.version` pins a different release; the default is 11.6.0.
