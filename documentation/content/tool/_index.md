---
title:     Visual tools
linkTitle: tool
date:      2026-04-02
menus:     main
summary:   Every shortcode maps to a tool partial. Add help="yes" to any hw call to see its parameters inline.
---

Every `{{&lt; hw t = "X" >}}` shortcode maps to `layouts/_partials/tool/X.html`.
Click any tool below to see its parameter reference, or add `help = "yes"` to
a shortcode in your own page to see the help card inline.

To extend PiHuW, drop `layouts/_partials/tool/mytool.html` into your site.
Add `layouts/_partials/tool/mytool-help.html` to enable `help = "yes"` for it.

---

{{< hw t = "item-group-by-type" count = 100 />}}
