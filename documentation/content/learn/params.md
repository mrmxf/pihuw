---
title:     Parameter Cascade
linkTitle: params
date:      2026-03-30
summary:   'How pihuw resolves param values — and who controls each level'
---

## TL;DR

Parameters are resolved in this order. **Later entries win.**

| Priority | Source | Who sets it |
|----------|--------|-------------|
| 1 | Inline string hardcoded in a theme partial | Theme developer |
| 2 | Theme `assets/data/defaults.yaml` | Theme developer |
| 3 | `site.Params.group.thing` in `config/_default/params.yaml` | Webmaster |
| 4 | Site `assets/data/defaults.yaml` or site override partial | Webmaster |
| 5 | `cascade:` block in a section `_index.md` | Section editor |
| 6 | `.Page.Params.thing` in page frontmatter | Page creator |
| 7 | `hw` shortcode attribute | Page creator |

---

## Param Details

### Priority 1 — Inline string in a theme partial

**What it is:** A hardcoded fallback baked directly into the template source. It is
the last resort when nothing else has been set.

**Stakeholder:** Theme developer. This value ships with the theme and requires a code
change to alter it.

**Examples:**

- `tool/banner.html` — `$imgClass := .srcClass | default ""`. When no `srcClass` is
  passed and nothing in params.yaml says otherwise, the image div carries no extra
  CSS class. The empty string is a safe no-op default that the developer chose
  deliberately so the element still renders.

- `tool/feature.html` — `$headerClass := .headerClass | default "header"`. The
  string `"header"` is the PicnicCSS class that styles a bold feature heading. Any
  site that uses a different CSS framework can override this through the cascade;
  the inline string is the sensible starting point.

---

### Priority 2 — Theme `assets/data/defaults.yaml`

**What it is:** Structured default values read at render time by `tk/get-defaults`.
Unlike an inline string, these values are co-located in one YAML file, making them
easy to audit and consistent across all components.

**Stakeholder:** Theme developer, but easier to change than inline strings because
you only edit one file.

**Examples:**

- `tool/item.html` — reads `$default.class.item_m.srcGrid` to set the responsive
  column width for an item's image column. The theme ships a grid class that fills
  one-third of the row at medium breakpoint. Every `item` component shares this
  value automatically.

- `tool/block.html` — reads `$default.class.block.imgClass` for the CSS class
  applied to block images. Changing it in `defaults.yaml` updates every block
  across the entire site without touching any partial.

---

### Priority 3 — `site.Params` in `config/_default/params.yaml`

**What it is:** Site-wide configuration set by whoever manages the Hugo project.
These values override both inline strings and `defaults.yaml`.

**Stakeholder:** Webmaster. This is the primary tuning point for adapting the theme
to a specific site without overriding any template code.

**Examples:**

- `tk/resource-image-featured.html` — reads `site.Params.FeaturedGlob` so the
  webmaster can change the glob used to find featured images across the whole site
  (e.g., `"hero*.*"` instead of the theme default `"featured*.*"`).

- `tool/gallery.html` — reads `site.Params.ui.gallery.default.colors` to generate
  CSS border and fill colours for each media type in gallery thumbnails. A webmaster
  for a dark-themed site sets these once in `params.yaml` and every gallery picks
  them up automatically.

---

### Priority 4 — Site `assets/data/defaults.yaml` or site override partial

**What it is:** A consumer site can replace the theme's `assets/data/defaults.yaml`
by mounting its own version via `module.yaml`. It can also drop an identically-named
partial into its own `layouts/` tree to completely replace a theme partial.

**Stakeholder:** Webmaster, with more precision than `site.Params`. Overriding
`defaults.yaml` changes CSS grid and class tokens; overriding a partial changes
logic.

**Examples:**

- A site mounts its own `assets/data/defaults.yaml` and changes
  `class.item_m.srcGrid` from a one-third column to a one-quarter column. Every
  `item` and `item-include` component in that site adapts without any partial edits.

- A site places its own `layouts/_partials/tk/resource-image-featured.html` to look
  for featured images in a different resource location or to apply a different fit
  size than `FeaturedWxH` allows. The site partial completely replaces the theme
  partial for that site.

---

### Priority 5 — `cascade:` block in a section `_index.md`

**What it is:** A Hugo-native mechanism where a section's `_index.md` pushes param
values down to all child pages automatically. Child pages receive these as
`.Page.Params` values without writing anything in their own frontmatter.

**Stakeholder:** Section editor — the person who manages a content section but is
not the webmaster and does not edit individual pages.

**Examples:**

- A `products/_index.md` sets:
  ```yaml
  cascade:
    params:
      FeaturedGlob: "hero*.*"
  ```
  Every product page now picks up `hero-*.jpg` as its featured image without each
  page author knowing the glob exists.

- A `blog/_index.md` sets:
  ```yaml
  cascade:
    params:
      FeaturedWxH: "400x300"
  ```
  Blog post featured thumbnails site-wide become wider than the theme default
  `200x200`, matching the blog's wider content column — configured once by the
  section editor, not repeated on every post.

---

### Priority 6 — `.Page.Params` in page frontmatter

**What it is:** Params declared in the YAML front matter of a specific page.
Overrides everything above for that page only.

**Stakeholder:** Page creator. This is the everyday tuning point for content authors.

**Examples:**

- `tk/resource-image-featured.html` — if a page sets `FeaturedGlob: "portrait*.*"`
  in its frontmatter, that page's featured image search uses the portrait glob while
  every other page uses the section or site default.

- `tool/gallery.html` — the gallery reads image paths from
  `$page.Params[$from]`, so the entire gallery content lives in page frontmatter:
  ```yaml
  params:
    photos:
      - images/cat.jpg
      - images/dog.png
  ```
  No shortcode attribute controls which images appear; it is entirely the page
  creator's data.

---

### Priority 7 — `hw` shortcode attribute

**What it is:** A value passed directly to a `{{</* hw */>}}` shortcode call inside
the page body. Overrides everything, including the page's own frontmatter defaults.

**Stakeholder:** Page creator, at the point of use. Useful when one page needs two
instances of the same component with different settings.

**Examples:**

- `tool/gallery.html` — `{{</* hw t="gallery" from="photos" mode="small" */>}}`.
  The `mode` attribute switches thumbnail size to `small` for this gallery only.
  A second gallery on the same page could use `mode="large"` without any frontmatter
  change.

- `tool/feature.html` — `{{</* hw t="feature" src="logo.svg" link="/about" */>}}`.
  The `link` attribute is entirely caller-supplied; there is no frontmatter or
  site-param fallback for it. The page creator decides at the point of authoring
  where each feature block links.
