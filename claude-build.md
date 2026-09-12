# claude-build.md — build and config

Detail for [CLAUDE.md](CLAUDE.md). Deploy is in [claude-deploy.md](claude-deploy.md).

## Commands

```bash
ln -s documentation/content content   # required: no content/ means an empty build
hugo --quiet                          # verify: must exit 0
rm content                            # always unlink; clog Check build fails on a stale link
clog watch                            # symlink + hugo server 1313 --buildDrafts --buildFuture
clog Check build                      # hugo version matches, content/ not linked
```

`clog watch` creates and removes the symlink itself. Do it by hand only for a one-off build.

## Facts

- Requires Hugo >= 0.161.0 extended (`config/_default/module.yaml`). 0.162.1 is installed.
- **`publishDir: kodata`**, not `public`. Output is committed — it is the `ko` container payload.
- `--cleanDestinationDir` therefore rewrites a tracked directory. Expect a large diff.
- `go.mod` declares `github.com/mrmxf/pihuw` at go 1.26.3. The module path is the theme name.
- `podserver.go` serves `kodata/` for the container image. Not used in development.
- SASS lives in `assets/css/`. `postcss.config.js` and `.nvmrc` exist; npm is optional.

## The module contract

`config/_default/module.yaml` `mounts:` is what consumers receive: layouts, assets,
`static/webfonts` (required by `assets/css/fa6.min.css`).

Deliberately NOT exported — adding any of these breaks consumer sites:

- `content/` — doc-site pages; consumers supply their own
- `static/favicon.ico`, `static/logo.png`, `static/rc/` — doc-site branding

Consumers upgrade with `hugo mod get github.com/mrmxf/pihuw@latest`, then `hugo mod vendor`.
A consumer's `module.yaml` may hold a `replacements:` line pointing at this working tree;
that is for theme development and must be commented out before they vendor.

## Config

| File | Fact |
|---|---|
| hugo.yaml | `title: PiHuW`, `publishDir: kodata` |
| params.yaml | `ui`, `extensions`, `bio` defaults. Consumer-overridable. |
| assets/data/defaults.yaml | every component's default classes. Read via `tk/get-defaults`. |
| module.yaml | `hugoVersion.min`, `mounts`. No `theme:` key anywhere. |

## Versioning

`assets/data/releases.yaml` is the release history; `clog bc-releases-yaml` resolves the path.
Tags need a `v` prefix — Hugo and Go both require it (`clog git tag ref`).
