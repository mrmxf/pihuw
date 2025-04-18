---
title: fo t = "include"
date:  2025-02-25

summary: |
  fohuw-include will insert the includeSummary of a page or the markdownified page.
---

## t = "include"

The builtin help can be printed by setting the help param to any string:

```markdown
{{</* fo t = "include" help = "yes" from = "folder/subFolder/file-to-include/md" /*/>}}
```

{{< fo t = "include" help = "yes" />}}

### Sample {{< H 1 >}} - no includeSummary, pink message blockClass

```markdown
{{</* fo t = "include" from = "/headless/include-example.md"  blockClass = "ui pink message" /*/>}}
```

{{< fo t = "include" from = "/headless/include-example.md" blockClass = "ui pink message" />}}

### Sample {{< H 1 >}} - no includeSummary, no blockClass

```markdown
{{</* fo t = "include" from = "/headless/include-example.md" /*/>}}
```

{{< fo t = "include" from = "/headless/include-example.md" />}}

### Sample {{< H 1 >}} - .params.includeSummary _in frontmatter_ + green segment blockClass

```markdown
{{</* fo t = "include" from = "/headless/include-example-summary.md"  blockClass = "ui green segment" /*/>}}
```

{{< fo t = "include" from = "/headless/include-example-summary.md" blockClass = "ui green segment" />}}