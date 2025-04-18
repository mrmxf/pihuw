---
title:     templates
linkTitle: templates
date:      2025-02-25

menus: main

summary: 'Templates provide the logic to render different types of pages.'
params:
  bodyClass: purple elephant

---

### General Parameters for templates

There are several params that you can use in a page to modify the look of that
page:

```yaml
title:  Some Page Title
params:
  bodyClass: purple container segment          # fomantic or custom class names
```

#### bodyClass

A `string` of fomantic or custom classes to control the look of a page.