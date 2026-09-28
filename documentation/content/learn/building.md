---
title:     Building
linkTitle: building
date:      2026-09-28
summary:   'Where the built site goes, why the docs site differs, and how to set it for your host'
---

## Your site builds to `public/`

pihuw does not choose where **your** site is written. `publishDir` is a root-level
Hugo setting, and Hugo never takes root-level settings from a theme or module. Unless
you set it yourself, `hugo` writes your site to Hugo's default, `public/`.

## Why the pihuw docs site uses `_clog_build/public/`

The theme repository sets `publishDir: _clog_build/public` in
`config/_default/hugo.yaml`. That affects only the docs site you are reading now.

The docs site is built and deployed by [clog](https://github.com/mrmxf/clog). Its CI
builds in one job and deploys in another, and the folders it passes between the two
are its own `_clog_build/` and `_clog_deploy/`. A site written anywhere else is built,
checked and then never published. Keeping the output inside `_clog_build/`
means the deploy job receives exactly the files the build job checked.

Older pihuw versions wrote to `kodata/`, a name inherited from an old container build
that no longer exists.

## Setting it for your own build system

Tell Hugo where your host expects the files, either in your site config:

```yaml
# config/_default/hugo.yaml (or hugo.yaml) in YOUR site
publishDir: public
```

or once, on the command line: `hugo --destination <dir>`. Then point your host at the
same folder:

| Build system | Set |
|---|---|
| clog | `publishDir: _clog_build/public`, and the same path as the target's `dir:` in `.clog.yaml` |
| GitHub Actions (`actions/upload-pages-artifact`) | `path: ./public` |
| Cloudflare Pages, Netlify | build output directory `public` |
| ko / a container image | `publishDir: kodata`, which ko copies into the image |
| A Raspberry Pi or a plain web server | copy `public/` to the server's web root |

Whatever you choose, add the folder to your `.gitignore`. It is generated, and
committing it mixes build output into your history.
