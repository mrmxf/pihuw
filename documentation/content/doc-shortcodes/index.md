---
title:     Shortcodes
linkTitle: shortcodes
date:      2025-04-14

menus: main

summary: 'FOHUW has only 2 shortcodes. fo & fohuw. This makes it easy to remember.'
params:
  bodyClass: purple elephant

---

## {{&lt; fohuw >}} - `layouts/shortcodes/fohuw.html`

This is a helper to print out the {{<fohuw>}} name in pretty colors

```markdown  {linenos=inline}
# Some page title

You can print the {{</*fohuw*/>}} name in pretty colors.
```

## {{&lt; fo `t = "thingy"` >}} -  `layouts/shortcodes/fo.html`

This is the main dispatcher for {{<fohuw>}}. When a shortcode like this is found:

```markdown  {linenos=inline}
# Some page title

This is some markdown with an image below.
{{</* fo t = "image" text = "Caption text" /*/>}}
```

the `fo` shortcode handler will parse the params into a standard set of keys and values before
running [`layouts/partials/fo.html`]({{% relref "/doc-partials" %}}).

### Params help

You can view the parameter help at any time while previewing your site with the following shortcode

```markdown  {linenos=inline}
{{</* fo t = "help" /*/>}}
```

All other parameters will be ignored, so if you can't remember the name of a parameter, then change `t = "image"` to
`t = "help"` to view the help file and then change it back again when you're happy.

{{<fo t = "help"/>}}