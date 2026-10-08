# claude-build.md — build and config

Detail for [CLAUDE.md](CLAUDE.md). Deploy is in [claude-deploy.md](claude-deploy.md).

## Commands

```bash
hugo --quiet                          # verify: must exit 0
clog watch                            # hugo server 1313 --buildDrafts --buildFuture
clog Check pihuw                      # installed hugo satisfies module.yaml's minimum
clog build                            # every gate, then hugo -> _clog_build/public/
```

**The `content/` symlink is NOT required.** `module.yaml`'s local-dev self-import mounts
`documentation/content -> content`, so a bare clone builds the full site. Verified
2026-09-21: a fresh `git clone` with no symlink builds all 73 pages, and the file set is
identical to a symlinked build. Do not add one: a stale symlink shadows the mount.

## Facts

- Requires Hugo >= 0.166.0 **extended** (`config/_default/module.yaml`). 0.166.0 is installed.
- `extended` is needed for **WebP encoding** (`tool/cover` emits `webp q80`), NOT for SASS.
  The theme has no SASS. Do not relax the requirement on the assumption that it was.
- **`publishDir: _clog_build/public`**, not `public`. clog's CI upload carries only its
  canonical `_clog_build/` and `_clog_deploy/` to the deploy job, so output anywhere else
  is built and never published. It is a root key: consumers never inherit it and get
  hugo's `public/`. Consumer-facing explanation: `documentation/content/learn/building.md`.
- `go.mod` declares `github.com/mrmxf/pihuw` at go 1.26.4. The module path is the theme name.
  It is there for Hugo modules only: the repo has no Go code, and must not gain any — a Go
  import here makes `hugo mod get` in every consumer try to resolve it.
- No SASS, no PostCSS, no npm. `assets/css/pihuw/*.css` is plain CSS, concatenated by
  `tmpl/head-css` into one minified, fingerprinted file. See `assets/css/pihuw/README.md`.
- There is no build step outside Hugo. `hugo --quiet` is the whole toolchain.

## The module contract

`config/_default/module.yaml` `mounts:` is what consumers receive: layouts, assets,
`static/webfonts` (required by `assets/css/fa6.min.css` and `02-fonts.css`). The text
faces are Atkinson Hyperlegible (body: 400, 400 italic, 700) and Raleway (headings, variable,
500-700), latin and latin-ext subsets only, from Google Fonts with their OFL licences beside
them. `02-fonts.css` holds Google's unicode-ranges; refresh files and CSS together. The CSS and all three FA fonts
(`fa-solid-900`, `fa-regular-400`, `fa-brands-400`, woff2) are Font Awesome 6.7.2 and must
be upgraded together: the CSS maps icon names to codepoints in THOSE fonts. The CSS's
`.ttf` fallbacks are not shipped (every supported browser takes woff2). There is no FA
JavaScript: icons are webfont glyphs in `<i>` elements.

Deliberately NOT exported — adding any of these breaks consumer sites:

- `content/` — doc-site pages; consumers supply their own
- `static/favicon.ico`, `static/logo.png`, `static/rc/` — doc-site branding

Consumers upgrade with `hugo mod get github.com/mrmxf/pihuw@latest`, then `hugo mod vendor`.
A consumer's `module.yaml` may hold a `replacements:` line pointing at this working tree;
that is for theme development and must be commented out before they vendor.

## Config

| File | Fact |
|---|---|
| hugo.yaml | `title: PiHuW`, `publishDir: _clog_build/public` |
| params.yaml | `ui`, `extensions`, `bio` defaults. Consumer-overridable. |
| assets/data/defaults.yaml | every component's default classes. Read via `tk/get-defaults`. |
| module.yaml | `hugoVersion.min`, `mounts`. No `theme:` key anywhere. |

## Versioning

`data/releases.yaml` is the release history (moved out of `assets/data/` in v0.4.10, so it is
Hugo data, read via `site.Data`, not `resources.Get`). `.clog.yaml` `releases-path` points at it.

Versions and prod mode come from git tags via `clog BC`; `releases.yaml` is history and
decides nothing. Tags need a `v` prefix — Hugo and Go both require it.
