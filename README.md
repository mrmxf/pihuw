# PiHuW

[PicnicCSS](https://picnicss.com/) wrapped as a Hugo theme, with extra blocks from FoHuw.
Deliberately tiny: no CDNs, no build step beyond Hugo, no SASS or npm. It is meant to run
in constrained environments — a Raspberry Pi, or an ESP32 serving its own site from a
tinygo server.

**Full documentation:** <https://mrmxf.github.io/pihuw>

## Requirements

Hugo **extended**, v0.166.0 or newer. Extended is required for WebP encoding, not for SASS.

## Run the documentation site locally

```sh
git clone https://github.com/mrmxf/pihuw.git
cd pihuw
hugo server
```

The docs live in `documentation/content/`, which `config/_default/module.yaml` mounts as
`content/` for local development — there is nothing to symlink.

With [clog](https://github.com/mrmxf/clog) installed, `clog watch` is the maintainer's
equivalent and adds `--buildDrafts --buildFuture`.

## Use it in your own site

```sh
hugo mod get github.com/mrmxf/pihuw@latest
```

Then add the import to your `config/_default/module.yaml`:

```yaml
imports:
  - path: github.com/mrmxf/pihuw
```

## Shortcodes

There is essentially one shortcode, `hw`, and a tool name selects the component:

```
{{< hw t="accordion" >}}
```

Every tool takes the same named parameters, so there is little to memorise. Each one
documents itself — `{{< hw t="help" >}}` lists them, and `{{< hw t="<name>" help="yes" >}}`
renders the reference card for a single tool. The tool list is deliberately not duplicated
here; it would go stale.

## Customising

In order of preference — forking is not on the list:

1. Override `assets/data/defaults.yaml` in your site.
2. Page frontmatter params.
3. Site params in `config/_default/params.yaml`.
4. Add CSS to `assets/css/site.css`, which loads after the theme.
5. Replace one theme stylesheet by name — see [`assets/css/pihuw/README.md`](assets/css/pihuw/README.md).
6. Override a partial by name in your own `layouts/`.

## Licence

See [LICENSE](LICENSE).
