---
title: hw t = "include"
date:  2025-02-25

summary: |
  pihuw-include will insert the includeSummary of a page or the markdownified page.
---

## t = "include"

The builtin help can be printed by setting the help param to any string:

```markdown
{{</* hw t = "include" help = "yes" from = "folder/subFolder/file-to-include.md" /*/>}}
```

{{< hw t = "include" help = "yes" />}}

### Sample {{< H 1 >}} - no includeSummary, highlighted card blockClass

```markdown
{{</* hw t = "include" from = "/headless/include-example.md"  blockClass = "card hi-1" /*/>}}
```

{{< hw t = "include" from = "/headless/include-example.md" blockClass = "card hi-1" />}}

### Sample {{< H 1 >}} - no includeSummary, no blockClass

```markdown
{{</* hw t = "include" from = "/headless/include-example.md" /*/>}}
```

{{< hw t = "include" from = "/headless/include-example.md" />}}

### Sample {{< H 1 >}} - .params.includeSummary _in frontmatter_ + card blockClass

```markdown
{{</* hw t = "include" from = "/headless/include-example-summary.md"  blockClass = "card" /*/>}}
```

{{< hw t = "include" from = "/headless/include-example-summary.md" blockClass = "card" />}}
