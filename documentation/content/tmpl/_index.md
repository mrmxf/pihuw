---
title:     Layout templates
linkTitle: tmpl
date:      2026-04-02
menus:     main
summary:   Structural partials for page layout. These are not called from shortcodes — they build the page frame around content.
---

The `tmpl/` partials build the structural scaffolding of every page: the `<head>`,
navigation, footer, SEO metadata, taxonomies, and pagination. They are called
from Hugo base templates (`baseof.html`, `home.html`, `list.html`, `single.html`),
not from content shortcodes.

Content authors do not call these directly. Developers extending the theme can
override any of them by placing an identically-named file in their site's
`layouts/_partials/tmpl/` folder.

---

## Head and assets

| Partial | Purpose |
|---|---|
| `head.html` | Assembles the full `<head>` element — calls head-css, head-js, head-favicons, page-description |
| `head-css.html` | Injects theme CSS; includes theme-init.js inline before CSS to prevent flash of wrong theme |
| `head-css-from-sass.html` | Builds CSS from SASS source; includes Fomantic UI elements |
| `head-js.html` | Injects JavaScript includes for libraries enabled in params.yaml |
| `head-favicons.html` | Renders favicon link tags |
| `favicons.html` | Favicon asset resolution helper |
| `body-scripts.html` | Deferred scripts injected just before `</body>` |

## Navigation

| Partial | Purpose |
|---|---|
| `navbar.html` | Top navigation bar — delegates to the three responsive breakpoint partials |
| `navbar-brand.html` | Site logo and name in the navbar |
| `navbar-btn-basic.html` | A single nav item with no children |
| `navbar-btn-parent.html` | A nav item that has a dropdown of child links |
| `navbar-lang-selector.html` | Language switcher dropdown (multi-language sites) |
| `navbar-s-smallscreen.html` | Navbar layout for small screens (< 500px) |
| `navbar-m-mediumscreen.html` | Navbar layout for medium screens (500–1100px) |
| `navbar-w-widescreen.html` | Navbar layout for wide screens (> 1100px) |
| `breadcrumb.html` | Page breadcrumb trail |
| `sidebar.html` | Left or right sidebar wrapper |
| `sidebar-tree.html` | Tree-style navigation listing in the sidebar; hidden with `Params.ui.hideSidebar` |
| `childbar-horizontal.html` | Horizontal list of child-section links; hidden with `Params.ui.hideChildbar` |
| `search-input.html` | Search input field |

## Page content frame

| Partial | Purpose |
|---|---|
| `page-title.html` | Page heading and subtitle area |
| `page-title-blog.html` | Blog-specific page heading with date and reading time |
| `page-description.html` | `<meta name="description">` tag — SEO page summary |
| `page-meta-lastmod.html` | Last-modified date badge |
| `page-meta-links.html` | Edit-on-GitHub and similar source links |
| `reading-time.html` | Calculates and renders estimated reading time |
| `toc.html` | Table of contents for the current page |
| `section-index.html` | Auto-generated index of child pages in a section |
| `numbered-header.html` | Numbered heading renderer — called by the `H` shortcode |

## Footer

| Partial | Purpose |
|---|---|
| `footer.html` | Full footer row — calls footer-left and footer-right |
| `footer-left.html` | Left-side footer content (site name, links) |
| `footer-right.html` | Right-side footer content (social icons, credits) |

## Pagination

| Partial | Purpose |
|---|---|
| `pagination.html` | Page-level pagination for list pages |
| `pager.html` | Previous / next navigation between sibling pages |

## Taxonomy

| Partial | Purpose |
|---|---|
| `taxonomy-tags-logic.html` | Decides which taxonomies to show on a page and calls taxonomy-tags for each |
| `taxonomy-tags.html` | Renders the tag/category labels for a single taxonomy |
| `taxonomy-display-class.html` | Returns the CSS class for a taxonomy label |
| `taxonomy-display-label.html` | Returns the display text for a taxonomy term |
| `taxonomy_terms_cloud.html` | Tag cloud for a single taxonomy |
| `taxonomy_terms_clouds.html` | All configured taxonomy clouds on one page |

## Data and utilities

| Partial | Purpose |
|---|---|
| `get-blogs-date.html` | Returns all blog pages sorted newest-first |
| `get-version-data.html` | Reads theme version metadata |
| `outputformat.html` | Handles alternate output formats (RSS, JSON) |
| `dbg-template-comment.html` | Emits an HTML comment with the current template name — server only |
