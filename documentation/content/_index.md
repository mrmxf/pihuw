---
title:     PiHuW Documentation
linkTitle: docs
date:      2026-04-02
---

{{<pihuw>}} is a lightweight Hugo theme built on [PicnicCSS](https://picnicss.com). It has a small footprint, loads all
assets locally (no CDNs by default), and is designed to run on resource-constrained devices such as Raspberry Pi and
ESP32 embedded web servers.

---

## Two ways to use this theme

### Authors — writing content for a site

You write markdown pages using frontmatter and the `{{&lt; hw >}}` shortcode. You do not need to understand Hugo
internals, partial call chains, or image processing strings. Sensible defaults are provided for everything.

Start here: [Shortcodes](/shortcodes) → [Visual tools](/tool) → [Kitchen sink](/kitchen_sink)

### Developers — building compatible partials and extending the theme

You write Hugo partial templates in `layouts/_partials/tool/` (or `tmpl/`). The `hw` shortcode dispatcher, error
handling, help system, opt validation, and asset pipeline are all provided — you only write the rendering logic.

Start here: [Layout templates](/tmpl) → [Developer toolkit](/tk) → `CLAUDE.md`

---

## How content types and tags work

Hugo assigns every page a **type** equal to the name of its immediate parent folder under `content/`. A page at
`content/blog/my-post.md` has type `blog`. A page at `content/stories/chapter-1.md` has type `stories`.

This matters because several visual tools filter or group pages by type:

- `{{&lt; hw t = "item-group-by-type" >}}` lists the direct children of the current section — the type is derived
  automatically from the folder name
- `{{&lt; hw t = "blog" >}}` is a convenience wrapper that hardcodes `type = "blog"`

**Tags** are different: they are taxonomy values declared in page frontmatter and managed by Hugo's taxonomy system.
Tags span sections and types; a page in `content/blog/` and a page in `content/stories/` can both carry the tag
`"hugo"`.

```yaml
# frontmatter example — content/blog/my-post.md
---
title: My Post
tags:
  - hugo
  - raspberry-pi
---
```

Use **type** to group pages by their structural role in the site (section).
Use **tags** to cross-link pages by topic regardless of where they live.

---

## Discovering shortcode parameters

Every visual tool documents its own parameters inline. Add `help = "yes"` to any
`hw` shortcode to replace the rendered output with its help card:

```markdown
{{</* hw t = "image" help = "yes" /*/>}}
```

Change `t = "image"` to any tool name. All other parameters are ignored when
`help` is present. Remove `help = "yes"` when you are done.

---

## Theme sections

| Section                      | What it covers                                                                   |
|------------------------------|----------------------------------------------------------------------------------|
| [Shortcodes](/shortcodes)    | The `hw`, `pihuw`, and `H` shortcodes - the author entry point                   |
| [Visual tools](/tool)        | Every `{{&lt; hw t = "X" >}}` component and its parameters                         |
| [Layout templates](/tmpl)    | Structural partials: head, nav, footer, SEO, pagination                          |
| [Developer toolkit](/tk)     | Value-returning utilities: asset resolution, image processing, opt validation    |
| [Kitchen sink](/kitchen_sink)| One live example of every visual tool                                            |
