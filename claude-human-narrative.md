# claude-human-narrative.md — why PiHuW is shaped this way

Background for [CLAUDE.md](CLAUDE.md). Nothing here is a rule. Read it when a decision
looks arbitrary and you want the reasoning, or when writing docs for people.

## The two audiences

PiHuW serves a content author and a site integrator, and they need opposite things.

The **author** writes frontmatter and shortcode attributes. They should never learn that
Hugo has an image pipeline, that `resize x100` is a process string, or that a partial can
return a dict. Every time a param leaks an internal concept, that is a bug in the theme's
interface, not a gap in the author's knowledge. This is why params take `size: "small"`
and why every default lives in `params.yaml` or `assets/data/defaults.yaml`.

The **integrator** overrides by filename and nothing else. They never fork a partial,
because a fork stops receiving theme fixes silently. Six sites consume this module, so a
theme bug fixed here fixes all six, and a theme bug worked around in one consumer fixes none.

## Why the footprint matters

The target is a Raspberry Pi or an ESP32 serving its own site. That makes no-CDN-by-default
a hard constraint rather than a preference: there may be no upstream to reach. It is also
why extensions (mermaid, katex, markmap, graph) are opt-in — each one pulls a payload that
a constrained host pays for on every request.

## Why partials are split four ways

The directory a partial lives in tells you its calling convention, which is the thing most
likely to be got wrong:

- `tk/` returns values and must emit nothing. The hardest rule in the theme.
- `tmpl/` emits layout and is called by base templates.
- `tool/` emits a component and pairs one-to-one with a shortcode type.
- `hook/` emits nothing at all, by contract, forever.

A partial in the wrong directory misleads the next reader about whether its output is
wanted — and for `tk/`, emitting output silently destroys the return value.

## Why hooks are empty

Consumers are told they may copy the entire `hook/` folder into their own `layouts/`. That
permission is only safe while every file is empty. The moment the theme puts real content
in a hook, every consumer holding a copied empty override loses that feature with no error
and no clue — Hugo resolves the name to exactly one file and their copy wins.

So the inertness promise is load-bearing, not tidiness. A feature that needs a fixed page
position goes in `tmpl/` and is called from the base template, where consumers cannot
accidentally shadow it.

## Why the docs mirror the layouts

`documentation/content/` maps one-to-one onto `layouts/`, and each `content/tool/X.md`
renders its own help card via `{{< hw t="X" help="yes" >}}`. The docs are therefore built
from the same partials they document: a broken component produces broken documentation,
visibly, on the docs site. Help text that drifts from the code is the one class of doc rot
this arrangement cannot catch — see `M-15` in [claude-backlog.md](claude-backlog.md) for a
live example.

## Customisation, in order of preference

1. Override `assets/data/defaults.yaml` in the consumer site.
2. Page frontmatter params — `bodyClass`, `FeaturedGlob`, `FeaturedWxH`.
3. Site params in `config/_default/params.yaml` — `ui`, `extensions`, `bio`.
4. Override a partial by name in the consumer's `layouts/`.

Forking is not on the list.
