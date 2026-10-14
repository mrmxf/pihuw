---
title:     hero-message
date:      2026-10-14
build:
  list:   never
  render: always
summary:   A dated message in the hero band, from front matter.
hero-message:
  - text: Shown only if no dated entry below were due yet.
  - date: 2026-01-01
    media: {src: /rc/logo.png, alt: PiHuW logo}
    md: |
      This page's `hero-message:` front matter.<br>
      The latest **dated** entry that is due, with media beside it.
---

## hero-message · [parameters →](/tool/hero-message)

`tool/cover` renders the page's `hero-message:` whenever it emits the page's h1, so
this band needs nothing but a header. Pass `message = "false"` to turn it off.

{{< hw
  t      = "cover"
  src    = "/rc/logo.png"
  alt    = ""
  header = "Hero message"
/>}}
