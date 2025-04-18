---
title: headless include page with summary
date:  2025-04-14

params:
  includeSummary: |
    `.params.includeSummary` _frontmatter text from this similar markdown file:_

    Just like the body text, you can have formatting, HTML and shortcodes in a
    {{<fohuw>}} summary.
---
This is a similar markdown file in the `headless` folder. It **does** have a
`params.includeSummary` field in the frontmatter.

The {{<fohuw>}} `include` partial should not show this text because the
frontmatter params override it. Try changing the name of the params parameter
from `params.includeSummary` to `params.banana` to sdee how the
rendering changes.

Markdown files may include shortcodes.
