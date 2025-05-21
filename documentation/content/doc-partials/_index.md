---
title:     partials
linkTitle: partials
date:      2025-04-14

menus: main

summary: 'Partials produce HTML. These are the building blocks of pihuw.'
params:
  bodyClass: purple elephant

---

## `layouts/_partials/pi.html`

This is the main dispatcher for pihuw. When a shortcode like this is found:

```markdown  {linenos=inline}
# Some page title

This is some markdown with an image below.
{{</* pi t = "image" text = "Caption text" /*/>}}
```

the `pi` shortcode handler will [parse the params]( {{% relref "/doc-shortcodes" %}} ) into a standard set of keys and values before
running `layouts/_partials/pi.html`.

Finally the dispatcher partial uses shortcode's `t = "thingy"` param to run a partial called `pihuw-thingy.html`. If you
want to extend the pihuw ecosystem, simply put a partial with the right name in your `layouts/_partials` folder. All the
parsing, error checking, help and other functions will be done for you.
