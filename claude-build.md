# claude-build.md — build and config

Detail for [CLAUDE.md](CLAUDE.md). Deploy is in [claude-deploy.md](claude-deploy.md).

## Commands

```bash
hugo --quiet                          # verify: must exit 0
clog watch                            # symlink + hugo server 1313 --buildDrafts --buildFuture
clog Check build                      # hugo version matches, content/ not linked
```

**The `content/` symlink is NOT required.** `module.yaml`'s local-dev self-import mounts
`documentation/content -> content`, so a bare clone builds the full site. Verified
2026-09-21: a fresh `git clone` with no symlink builds all 73 pages, and the file set is
identical to a symlinked build. `clog watch` still creates one, and `clog Check build`
fails on a stale one, so never leave it behind — but do not add it by hand believing the
build needs it.

## Facts

- Requires Hugo >= 0.161.0 **extended** (`config/_default/module.yaml`). 0.166.0 is installed.
- `extended` is needed for **WebP encoding** (`tool/cover` emits `webp q80`), NOT for SASS.
  The theme has no SASS. Do not relax the requirement on the assumption that it was.
- **`publishDir: kodata`**, not `public`. Output is committed — it is the `ko` container payload.
- `--cleanDestinationDir` therefore rewrites a tracked directory. Expect a large diff.
- `go.mod` declares `github.com/mrmxf/pihuw` at go 1.26.3. The module path is the theme name.
- `podserver.go` serves `kodata/` for the container image. Not used in development.
- No SASS, no PostCSS, no npm. `assets/css/pihuw/*.css` is plain CSS, concatenated by
  `tmpl/head-css` into one minified, fingerprinted file. See `assets/css/pihuw/README.md`.
- There is no build step outside Hugo. `hugo --quiet` is the whole toolchain.

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
