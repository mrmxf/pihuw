---
title:     tables
date:      2026-04-02
build:
  list:   never
  render: always
summary:   Table shortcodes — table, thead, tbody, tfoot, tr, th, td, trtd, trth.
---

## table family · [table →](/tool/table) · [thead →](/tool/thead) · [tbody →](/tool/tbody) · [tfoot →](/tool/tfoot) · [tr →](/tool/tr) · [th →](/tool/th) · [td →](/tool/td) · [trtd →](/tool/trtd) · [trth →](/tool/trth)

{{< hw t = "table" >}}
  {{< hw t = "thead" >}}
    {{< hw t = "tr" >}}
      {{< hw t = "th" >}}Name{{< /hw >}}
      {{< hw t = "th" >}}Type{{< /hw >}}
      {{< hw t = "th" >}}Description{{< /hw >}}
    {{< /hw >}}
  {{< /hw >}}
  {{< hw t = "tbody" >}}
  {{< hw t = "tr" >}}
    {{< hw t = "td" >}}table{{< /hw >}}
    {{< hw t = "td" >}}wrapper{{< /hw >}}
    {{< hw t = "td" >}}Outer container for the entire table{{< /hw >}}
  {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}thead{{< /hw >}}
      {{< hw t = "td" >}}wrapper{{< /hw >}}
      {{< hw t = "td" >}}Header row group — wraps trth rows{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}tbody{{< /hw >}}
      {{< hw t = "td" >}}wrapper{{< /hw >}}
      {{< hw t = "td" >}}Body row group — wraps trtd rows{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}tfoot{{< /hw >}}
      {{< hw t = "td" >}}wrapper{{< /hw >}}
      {{< hw t = "td" >}}Footer row group{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}tr{{< /hw >}}
      {{< hw t = "td" >}}row{{< /hw >}}
      {{< hw t = "td" >}}A single row — nest th or td cells inside{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}th{{< /hw >}}
      {{< hw t = "td" >}}cell{{< /hw >}}
      {{< hw t = "td" >}}Header cell{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}td{{< /hw >}}
      {{< hw t = "td" >}}cell{{< /hw >}}
      {{< hw t = "td" >}}Data cell{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}trtd{{< /hw >}}
      {{< hw t = "td" >}}shortcut{{< /hw >}}
      {{< hw t = "td" >}}Row of data cells from a single call{{< /hw >}}
    {{< /hw >}}
    {{< hw t = "tr" >}}
      {{< hw t = "td" >}}trth{{< /hw >}}
      {{< hw t = "td" >}}shortcut{{< /hw >}}
      {{< hw t = "td" >}}Row of header cells from a single call{{< /hw >}}
    {{< /hw >}}
  {{< /hw >}}
  {{< hw t = "tfoot" >}}
    {{< hw t = "trtd" >}}colspan applies via class parameter{{< /hw >}}
  {{< /hw >}}
{{< /hw >}}
