---
title:     Shortcodes
linkTitle: shortcodes
date:      2025-04-14

menus: main

summary: 'pihuw has only 2 shortcodes. hw & pihuw. This makes it easy to remember.'
params:
  bodyClass: purple elephant

---

## {{&lt; pihuw >}} - `layouts/_shortcodes/pihuw.html`

This is a helper to print out the {{<pihuw>}} name in pretty colors

```markdown  {linenos=inline}
# Some page title

You can print the {{</*pihuw*/>}} name in pretty colors.
```

## {{&lt; hw `t = "thingy"` >}} -  `layouts/_shortcodes/pi.html`

This is the main dispatcher for {{<pihuw>}}. When a shortcode like this is found:

```markdown  {linenos=inline}
# Some page title

This is some markdown with an image below.
{{</* hw t = "image" text = "Caption text" /*/>}}
```

the `hw` shortcode handler will parse the params into a standard set of keys and values before
running [`layouts/_partials/hw.html`]({{% relref "/doc-partials" %}}).

### Params help

You can view the parameter help at any time while previewing your site with the following shortcode

```markdown  {linenos=inline}
{{</* hw t = "help" /*/>}}
```

All other parameters will be ignored, so if you can't remember the name of a parameter, then change `t = "image"` to
`t = "help"` to view the help file and then change it back again when you're happy.

{{<hw t = "help"/>}}