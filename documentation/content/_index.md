---
title:     PiHuW Documentation
linkTItle: docs
date:      2025-03-31
---

{{<pihuw>}} is a very basic css driven static site.

It has a small footprint and is aimed at creating embedded webservers on Pi-PICO and ESP32 devices. All css is loaded
locally and no CDNs are accessed. You can override this if it makes you happy.

{{< pi t = "accordion" >}}

{{< pi t = "acc-tab" header = "**heading 1**" >}}

content 1

content 2

{{< /pi >}}

{{< pi t = "acc-tab" header = "**ywo**" >}}
content two
{{< /pi >}}

{{< /pi >}}