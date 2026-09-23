# claude-deploy.md — deploy

Detail for [CLAUDE.md](CLAUDE.md). Build is in [claude-build.md](claude-build.md).

This deploys the **documentation site** to GitHub Pages. The theme itself ships as a Hugo
module — consumers get it from a git tag, so there is nothing to deploy for that.

## Commands

```bash
clog build prod              # every gate, then hugo -> kodata/. Refuses a HEAD that is not a clean v* tag
clog deploy prod --dry-run   # what would be published, publishing nothing
clog deploy prod             # kodata/ -> force-push gh-pages -> https://mrmxf.github.io/pihuw/
```

## A release

Push a `v*` tag. [build-deploy.yaml](.github/workflows/build-deploy.yaml) calls mrmxf/clog's
`build-check.yaml`, then `deploy-probe.yaml`, which publishes the exact `kodata/` the build
gated and then probes the live site. A push to `main` builds and stops. A manual run
republishes the **newest release tag**, whichever branch it is launched from.

## Facts

- Target, branch and base URL are data in `.clog.yaml` (`ci.targets.pages`, `ci.modes`).
- `prod` only: there is one Pages site, and a dev build would overwrite the published docs.
- `gh-pages` is force-pushed; it has no history worth keeping.
- No secrets. The push uses the Actions token; `.clog.yaml` has no `ci.infisical` block.
- `.clog-version` pins the clog that CI and laptops install. Bump it deliberately.
