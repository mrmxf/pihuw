---
title:     Shortcodes
linkTitle: shortcodes
date:      2026-04-02
menus:     main
summary:   PiHuW has three shortcodes. hw is the main one — it dispatches to every visual tool.
---

PiHuW provides three shortcodes. Authors use them in markdown pages.

---

## `hw` — the main dispatcher

`hw` is the only shortcode most authors ever need. It routes to any visual tool
via the `t` parameter:

```markdown
{{&lt; hw t = "image" src = "photo.jpg" alt = "A photo" />}}
{{&lt; hw t = "banner" header = "Welcome" text = "This is the intro." />}}
{{&lt; hw t = "accordion" >}}
  {{&lt; hw t = "acc-tab" header = "Section one" >}}Content here.{{&lt; /hw >}}
{{&lt; /hw >}}
```

### Getting help for any tool

Add `help = "yes"` to any `hw` call to replace the rendered output with that
tool's parameter reference card:

```markdown
{{&lt; hw t = "image" help = "yes" />}}
```

All other parameters are ignored when `help` is present. Remove it when done.

To show all tool help cards at once:

```markdown
{{&lt; hw t = "help" />}}
```

### Parameter reference

| Parameter    | Type   | Description                                                            |
|--------------|--------|------------------------------------------------------------------------|
| `t`          | string | Tool name — routes to `layouts/_partials/tool/{t}.html` (required)     |
| `help`       | string | Any value → shows help for `t` instead of rendering it                 |
| `opt`        | JSON   | Tool-specific options string e.g. `'{"no-auto-tag": true}'`            |
| `sort`       | string | Space-separated sort keywords: `date` `title` `type` `asc` `desc`      |
| `alt`        | string | Alt text for images and videos                                         |
| `blockClass` | string | CSS class on the outermost wrapper div                                 |
| `class`      | string | CSS class on the main element                                          |
| `count`      | number | How many items to show (listings)                                      |
| `dbg`        | string | Any value → dumps the full parameter dict as a debug panel             |
| `description`| string | Body text or hover text                                                |
| `from`       | string | Path to source file when `t = "include"`                               |
| `header`     | string | Heading text (supports markdown bold/italic)                           |
| `headerClass`| string | CSS class overrides for the header element                             |
| `headerLink` | string | href wrapped around the header                                         |
| `id`         | string | Anchor id on the block                                                 |
| `link`       | string | Default href for any clickable element                                 |
| `meta`       | string | Secondary text below the header (e.g. date, reading time)              |
| `mode`       | string | Mode string for tools that support multiple display modes              |
| `process`    | string | Hugo image process string for the full-res asset e.g. `fit 600x400`    |
| `skip`       | number | How many items to skip before showing (listings)                       |
| `src`        | string | Relative path or URL to an image, video, or resource                   |
| `srcClass`   | string | CSS class on the media element wrapper                                 |
| `srcId`      | string | Anchor id on the media element                                         |
| `srcLink`    | string | href wrapped around the media element                                  |
| `srcOn`      | string | `left` `right` `none` — position of media relative to text             |
| `srcPoster`  | string | Poster image for video or non-image resources                          |
| `srcWidth`   | number | Proportion of the column for media (`0.0`–`1.0`)                       |
| `text`       | string | Short markdown rendered as a caption or supplementary text             |
| `thumb`      | string | Hugo process string for the thumbnail e.g. `x100`                      |

Inner content (between opening and closing tags) is rendered as markdown after
the description.

### How the dispatcher works

```text
{{&lt; hw t = "image" src = "photo.jpg" >}}
        │
        └─► layouts/_partials/hw.html
                    │
                    └─► layouts/_partials/tool/image.html
```

If `t` does not match any partial, a diagnostic message is shown in server mode.
If `help` is set, `tool/{t}-help.html` is loaded instead.

To extend PiHuW, drop a partial named `layouts/_partials/tool/mytool.html` into
your site's layouts folder. The shortcode will find and call it automatically.
Add a `layouts/_partials/tool/mytool-help.html` peer to enable inline help.

---

## `pihuw` — styled theme name

Prints the {{<pihuw>}} theme name in its branded colours.

```markdown
{{&lt; pihuw />}}              →  PiHuW
{{&lt; pihuw "-v" />}}         →  PiHuW v1.3.5
{{&lt; pihuw "--version" />}}  →  v1.3.5
```

Source: `layouts/_shortcodes/pihuw.html`

---

## `H` — numbered heading

Renders a numbered heading using the site's heading counter. The heading number
increments automatically across shortcode calls on the same page.

```markdown
{{&lt; H 1 />}} First section   →  1. First section
{{&lt; H 2 />}} A subsection    →  1.1. A subsection
{{&lt; H 1 />}} Second section  →  2. Second section
```

The positional parameter is the heading level (1–6, default 1).
Heading style is controlled by `params.yaml` under `ui.headings`.

Source: `layouts/_shortcodes/H.html` → `layouts/_partials/tmpl/numbered-header.html`
