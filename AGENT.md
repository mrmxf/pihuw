## Project Identity

```yaml
project:
  name: PiHuW (Pi Hugo Web)
  purpose: A super lightweight, functional Hugo theme for resource-constrained environments like ESP32 or Raspberry Pi PICO.
  based on: PicnicCSS
  principles:
    - Minimalism: Keep the footprint small. Avoid external dependencies and CDNs by default.
    - Simplicity: The theme should be easy to understand, use, and modify.
    - Hugo Native: Leverage Hugo's built-in features for templating and content management.
```

## Project Architecture

```yaml
structure:
  description: Standard Hugo theme structure.
  directories:
    /layouts/: Contains all Hugo templates.
      _default/: Base templates (baseof.html, list.html, single.html).
      partials/: Reusable template snippets. The core logic for the `pi` shortcode is dispatched from here.
      shortcodes/: Shortcode definitions.
    /assets/:
      data/defaults.yaml: Crucial file containing default class names and settings for components.
    /documentation/: A complete Hugo site that serves as the project's documentation and an example implementation.
    /README.md: High-level project overview and setup instructions.
    /CONTRIBUTING.md: Guidelines for contributors.
```

## Core Features

```yaml
features:
  shortcodes:
    hw:
      description: The main, multi-purpose shortcode that acts as a component dispatcher.
      usage: '{{< hw t="feature-name" ... >}}'
      implementation: The shortcode in `layouts/shortcodes/hw.html` passes parameters to a central partial, `layouts/_partials/hw.html`, which renders components based on the `t` parameter.
      help: '{{< hw t="help" >}} renders inline documentation for all available features.'
    pihuw:
      description: A simple presentation shortcode to display the project's name in stylized colors.
  partials:
    - name: hw.html
      description: Main shortcode dispatcher. Routes `t` parameter to `tool/<t>.html`. Pass `t="help"` for all docs or `help="any"` to render a single tool's help.
    - name: pi-dbg.html
      description: Top-level debug partial. Supports `mode` values dump, err, log for different debug output styles. Server-only.
    - name: hw-tk/dbg.html
      description: Outputs debug error/warning messages and key-value pairs as HTML. Server-only, hidden in production.
    - name: hw-tk/dbg-template.html
      description: Injects an HTML comment with the current template name. Used for development tracing. Server-only.
    - name: hw-tk/get-asset.html
      description: Resolves an asset by searching page resources, then assets/, then static/. Returns the resolved asset object.
    - name: hw-tk/get-defaults.html
      description: Returns parsed assets/data/defaults.yaml as a map. Central source for all component default class names and settings.
    - name: hw-tk/get-logo-path-string.html
      description: Resolves the site logo path from site.Params.ui.logo, checking assets/ and static/ directories in order.
    - name: hw-tk/help-card.html
      description: Wraps help content in a clickable Fomantic UI modal trigger. Renders the help card for each tool.
    - name: hw-tk/_help_common.html
      description: Shared CSS styles for the help modal system. Provides consistent styling across all tool help modals.
    - name: hw-tk/help-description.html
      description: Renders the description and info-notes section within a tool help modal.
    - name: hw-tk/help-examples.html
      description: Renders code examples with descriptions and notes within a tool help modal.
    - name: hw-tk/help-header.html
      description: Renders the shortcode usage syntax and parameter summary header within a tool help modal.
    - name: hw-tk/help.html
      description: Entry point for t="help". Renders an index of all tool partials that have registered help cards.
    - name: hw-tk/help-notes.html
      description: Renders warnings, best practices, and additional notes within a tool help modal.
    - name: hw-tk/help-params.html
      description: Renders a parameter documentation table (name, type, required) within a tool help modal.
    - name: hw-tk/help-tk.html
      description: Injects consolidated CSS and JavaScript required by the help modal system.
    - name: hw-tk/kvListNoPage.html
      description: Debug utility returning a key-value map of context data excluding page elements. Server-only.
    - name: hw-tk/pageList.html
      description: Debug utility returning the current page hierarchy as a string. Server-only.
    - name: hw-tk/render.html
      description: Debug rendering utility that displays and logs error messages during development. Server-only.
    - name: hw-tk/templateList.html
      description: Debug utility returning the current template hierarchy as a string. Server-only.
    - name: tmpl/body-scripts.html
      description: Injects all body-level JavaScript script tags before closing body.
    - name: tmpl/breadcrumb.html
      description: Renders a breadcrumb navigation trail for the current page.
    - name: tmpl/childbar-horizontal.html
      description: Renders a horizontal bar of child-page links. Hideable via Params.hide.childbar. Supports custom title and separator.
    - name: tmpl/dbg-template-comment.html
      description: Injects an HTML comment with the current template name. Variant of hw-tk/dbg-template for tmpl/ partials.
    - name: tmpl/favicons.html
      description: Renders all favicon link tags in the document head.
    - name: tmpl/footer.html
      description: Renders the page footer, composing footer-left and footer-right sections.
    - name: tmpl/footer-left.html
      description: Renders the left content area of the page footer.
    - name: tmpl/footer-right.html
      description: Renders the right content area of the page footer.
    - name: tmpl/get-blogs-date.html
      description: Returns all pages from the blog section sorted by date descending. Used by blog listing components.
    - name: tmpl/get-version-data.html
      description: Returns a dict of the first entry from assets/data/releases.yaml for version display. Path configurable via site.Params.releaseTracking.
    - name: tmpl/head-css-from-sass.html
      description: Injects CSS compiled from SASS source files into the document head.
    - name: tmpl/head-css.html
      description: Injects all CSS link tags into the document head.
    - name: tmpl/head-favicons.html
      description: Injects favicon-related meta and link tags into the document head.
    - name: tmpl/head.html
      description: Renders the full head element, composing head-css, head-js, head-favicons, and page metadata tags.
    - name: tmpl/head-js.html
      description: Injects JavaScript script tags into the document head.
    - name: tmpl/navbar-brand.html
      description: Renders the navbar brand/logo element using the resolved logo path.
    - name: tmpl/navbar-btn-basic.html
      description: Renders a basic navbar link/button item for a single menu entry.
    - name: tmpl/navbar-btn-parent.html
      description: Renders a navbar button that expands into a child dropdown menu.
    - name: tmpl/navbar.html
      description: Renders the full navigation bar, composing brand, menus, and responsive screen-size variants.
    - name: tmpl/navbar-lang-selector.html
      description: Renders a language selector dropdown in the navbar for multilingual Hugo sites.
    - name: tmpl/navbar-m-mediumscreen.html
      description: Navbar layout variant rendered on medium-width screens.
    - name: tmpl/navbar-s-smallscreen.html
      description: Navbar layout variant for small/mobile screens, typically a collapsible hamburger menu.
    - name: tmpl/navbar-w-widescreen.html
      description: Navbar layout variant for wide screens, rendering the full horizontal menu from site.Menus.main.
    - name: tmpl/numbered-header.html
      description: Renders section headings with configurable numbering prefix, separator, and suffix from site.Params.heading.
    - name: tmpl/outputformat.html
      description: Returns the current page output format (e.g. HTML, RSS). Used for conditional rendering logic.
    - name: tmpl/page-description.html
      description: Renders the page description as a meta or visible element.
    - name: tmpl/page-meta-lastmod.html
      description: Renders the page last-modified date as metadata.
    - name: tmpl/page-meta-links.html
      description: Renders edit/source links for the current page (e.g. link to repository source).
    - name: tmpl/pager.html
      description: Renders simple previous/next page navigation links.
    - name: tmpl/page-title.html
      description: Renders the page title element.
    - name: tmpl/pagination.html
      description: Renders full pagination controls for list/section pages.
    - name: tmpl/reading-time.html
      description: Renders estimated reading time for the current page.
    - name: tmpl/search-input.html
      description: Renders a search input field for site search.
    - name: tmpl/section-index.html
      description: Renders an index listing of all pages within the current section.
    - name: tmpl/sidebar.html
      description: Renders the page sidebar. Hideable via Params.ui.hide.sidebar.
    - name: tmpl/sidebar-tree.html
      description: Renders the hierarchical navigation tree for the current section inside the sidebar.
    - name: tmpl/taxonomy-display-class.html
      description: Maps a CSS display class to a taxonomy based on its position within the full taxonomy range.
    - name: tmpl/taxonomy-display-label.html
      description: Maps a display label to a taxonomy based on its position within the taxonomy range.
    - name: tmpl/taxonomy-tags.html
      description: Renders taxonomy tag badges for the current page.
    - name: tmpl/taxonomy-tags-logic.html
      description: Decides which taxonomies to display based on site.Params.taxonomy.showOnPage configuration.
    - name: tmpl/taxonomy_terms_cloud.html
      description: Renders a tag cloud for a single specified taxonomy type.
    - name: tmpl/taxonomy_terms_clouds.html
      description: Renders tag clouds for all taxonomy types configured in site.Params.taxonomy.taxonomyCloud.
    - name: tmpl/toc.html
      description: Renders the table of contents for the current page.
    - name: tool/accordion.html
      description: Renders a collapsible accordion component.
    - name: tool/accordion-help.html
      description: Inline docs for accordion.
    - name: tool/acc-tab.html
      description: Renders tabbed content within an accordion.
    - name: tool/acc-tab-help.html
      description: Inline docs for acc-tab.
    - name: tool/banner.html
      description: Renders a full-width banner or hero section.
    - name: tool/banner-help.html
      description: Inline docs for banner.
    - name: tool/block.html
      description: Core layout block component.
    - name: tool/block-help.html
      description: Inline docs for block.
    - name: tool/blockdef.html
      description: Wraps a block in definition styling. No -help peer; uses block.html internally.
    - name: tool/blog.html
      description: Renders a blog post listing or summary card.
    - name: tool/blog-help.html
      description: Inline docs for blog.
    - name: tool/caption.html
      description: Renders a figure caption element.
    - name: tool/caption-help.html
      description: Inline docs for caption.
    - name: tool/children.html
      description: Renders links to child pages of the current page.
    - name: tool/children-help.html
      description: Inline docs for children.
    - name: tool/col.html
      description: Wraps content in an HTML col element for table column definitions.
    - name: tool/colgroup.html
      description: Wraps content in an HTML colgroup element for table column grouping.
    - name: tool/cover.html
      description: Renders a cover or hero image section.
    - name: tool/cover-help.html
      description: Inline docs for cover.
    - name: tool/dbg.html
      description: Tool-scoped debug partial. Outputs key-value debug data or error messages. Server-only.
    - name: tool/env.html
      description: Outputs a Hugo site parameter (sourced from environment) as markdownified HTML content.
    - name: tool/feature.html
      description: Renders a single feature highlight card.
    - name: tool/feature-help.html
      description: Inline docs for feature.
    - name: tool/feature-group.html
      description: Renders a grid of feature cards.
    - name: tool/feature-group-help.html
      description: Inline docs for feature-group.
    - name: tool/fetch.html
      description: Fetches a remote URL via resources.GetRemote and includes the response content inline.
    - name: tool/gallery.html
      description: Renders an image gallery.
    - name: tool/gallery-help.html
      description: Inline docs for gallery.
    - name: tool/image.html
      description: Renders a responsive image element with configurable classes and attributes.
    - name: tool/image-help.html
      description: Inline docs for image.
    - name: tool/image-featured.html
      description: Renders the first page resource matching FeaturedGlob (default featured*.*), fitted to FeaturedWxH (default 200x200), with optional centered FeaturedCaption. All params from page frontmatter.
    - name: tool/image-fluid.html
      description: Thin wrapper over image.html that sets srcClass to fluid width. No -help peer.
    - name: tool/include.html
      description: Includes another file or partial inline within page content.
    - name: tool/include-help.html
      description: Inline docs for include.
    - name: tool/item.html
      description: Renders a single Fomantic UI list item.
    - name: tool/item-help.html
      description: Inline docs for item.
    - name: tool/item-group-blog.html
      description: Renders a group of blog item cards.
    - name: tool/item-group-blog-help.html
      description: Inline docs for item-group-blog.
    - name: tool/item-group.html
      description: Wraps items in a Fomantic UI divided items container. No -help peer.
    - name: tool/item-include.html
      description: Renders an item that includes externally sourced content.
    - name: tool/item-include-help.html
      description: Inline docs for item-include.
    - name: tool/item-socials.html
      description: Renders social media link items.
    - name: tool/item-socials-help.html
      description: Inline docs for item-socials.
    - name: tool/md-param.html
      description: Renders a named page frontmatter parameter as markdownified HTML output.
    - name: tool/md-param-help.html
      description: Inline docs for md-param.
    - name: tool/media.html
      description: Renders a media element (image or video) based on source type.
    - name: tool/media-help.html
      description: Inline docs for media.
    - name: tool/page-date.html
      description: Renders the page date with format and color configurable via site.Params.ui.pageDate.
    - name: tool/pretty-theme-name.html
      description: Renders the stylized "pihuw" project name, optionally with version number via args flag.
    - name: tool/smschat.html
      description: Renders a styled SMS/chat conversation UI component.
    - name: tool/smschat-help.html
      description: Inline docs for smschat.
    - name: tool/summary.html
      description: Renders a page summary with an image or video inside a UI segment container.
    - name: tool/table.html
      description: Renders an HTML table element.
    - name: tool/table-help.html
      description: Inline docs for table.
    - name: tool/tbody.html
      description: Wraps content in an HTML tbody element.
    - name: tool/tbody-help.html
      description: Inline docs for tbody.
    - name: tool/td.html
      description: Wraps content in an HTML td table data cell.
    - name: tool/td-help.html
      description: Inline docs for td.
    - name: tool/tfoot.html
      description: Wraps content in an HTML tfoot element.
    - name: tool/tfoot-help.html
      description: Inline docs for tfoot.
    - name: tool/th.html
      description: Wraps content in an HTML th table header cell.
    - name: tool/th-help.html
      description: Inline docs for th.
    - name: tool/thead.html
      description: Wraps content in an HTML thead element.
    - name: tool/thead-help.html
      description: Inline docs for thead.
    - name: tool/tooltip.html
      description: Renders text with a hover tooltip using text and alt parameters.
    - name: tool/tr.html
      description: Wraps content in an HTML tr table row.
    - name: tool/tr-help.html
      description: Inline docs for tr.
    - name: tool/trtd.html
      description: Renders a combined tr+td row with a data cell.
    - name: tool/trtd-help.html
      description: Inline docs for trtd.
    - name: tool/trth.html
      description: Renders a combined tr+th row with a header cell.
    - name: tool/trth-help.html
      description: Inline docs for trth.
    - name: tool/typist.html
      description: Renders a typewriter animation effect. Supports text, rate, header, and class parameters.
    - name: tool/video.html
      description: Renders an HTML5 video element with optional link and caption.
```

## Customization

```yaml
customization:
  primary_method: Overriding the theme's `assets/data/defaults.yaml` file in the user's own site.
  rationale: Allows for deep customization of component classes and settings without forking or modifying the theme directly.
  secondary_method: Using page frontmatter `params`.
  example: `bodyClass` in a page's frontmatter adds custom CSS classes to the `<body>` tag for that page.
```

## Coding Conventions

```yaml
conventions:
  templates: Use standard Hugo/Go template syntax. Keep logic clean and well-commented.
  styling: Adhere to PicnicCSS class names and patterns. Custom styles should be minimal.
  content: All content is written in Markdown.
  data: Configuration and data files use YAML.
```

## AI Assistant Guidelines

```yaml
instructions:
  new_feature: A new component will likely require modifying the central partial for the `pi` shortcode and adding new default values to `assets/data/defaults.yaml`.
  styling: To modify styling, the first place to check and modify is `assets/data/defaults.yaml`.
  source_of_truth: The `documentation/` site is the canonical source for usage examples.
  guiding_principle: When generating code or content, always respect the project's goal of being lightweight and minimal.
```
