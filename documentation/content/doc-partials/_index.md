---
title:     partials
linkTitle: partials
date:      2025-04-14

menus: main

summary: 'Partials produce HTML. These are the building blocks of FOHUW.'
params:
  bodyClass: purple elephant

---

## `layouts/partials/fo.html`

This is the main dispatcher for fohuw. When a shortcode like this is found:

```markdown  {linenos=inline}
# Some page title

This is some markdown with an image below.
{{</* fo t = "image" text = "Caption text" /*/>}}
```

the `fo` shortcode handler will [parse the params]( {{% relref "/fo-shortcodes" %}} ) into a standard set of keys and values before
running `layouts/partials/fo.html`.

Finally the dispatcher partial uses shortcode's `t = "thingy"` param to run a partial called `fohuw-thingy.html`. If you
want to extend the fohuw ecosystem, simply put a partial with the right name in your `layouts/partials` folder. All the
parsing, error checking, help and other functions will be done for you.
