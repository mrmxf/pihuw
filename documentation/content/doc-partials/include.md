---
title: pi t = "include"
date:  2025-02-25

summary: |
  pihuw-include will insert the includeSummary of a page or the markdownified page.
---

## t = "include"

The builtin help can be printed by setting the help param to any string:

```markdown
{{</* pi t = "include" help = "yes" from = "folder/subFolder/file-to-include/md" /*/>}}
```

{{< pi t = "include" help = "yes" />}}

### Sample {{< H 1 >}} - no includeSummary, pink message blockClass

```markdown
{{</* pi t = "include" from = "/headless/include-example.md"  blockClass = "ui pink message" /*/>}}
```

{{< pi t = "include" from = "/headless/include-example.md" blockClass = "ui pink message" />}}

### Sample {{< H 1 >}} - no includeSummary, no blockClass

```markdown
{{</* pi t = "include" from = "/headless/include-example.md" /*/>}}
```

{{< pi t = "include" from = "/headless/include-example.md" />}}

### Sample {{< H 1 >}} - .params.includeSummary _in frontmatter_ + green segment blockClass

```markdown
{{</* pi t = "include" from = "/headless/include-example-summary.md"  blockClass = "ui green segment" /*/>}}
```

{{< pi t = "include" from = "/headless/include-example-summary.md" blockClass = "ui green segment" />}}