# claude-plan-clog-pages.md — retire the legacy build, adopt clog BC

Detail for [CLAUDE.md](CLAUDE.md). Status: **pihuw side done. The clog side was written against the wrong repo and has been
withdrawn** — see "Course correction" below. Rewritten again 2026-09-21.
Rewritten 2026-09-21 against clog v0.11.14. Replaces the earlier "port the snippet" plan,
which was wrong: it assumed the `bc-*` shell era was current. It is not.

## Verdict

pihuw's build is two generations behind. Do not port it — delete it.

The `github-page` snippet, the `bc-prod-logic-*` / `bc-releases-yaml` / `git: tag:` shell
overrides in `.clog.yaml`, the `content/` symlink dance, and `gh-static.yml` are all legacy.
Everything they do is now done by `clog BC` Go commands and clog's callable workflows.

## The standard, verified today

Run against this repo on `dev`, two commits past the `v0.4.9` tag:

```
clog BC genBuildinfo --format version  -> v0.4.9+dev.2.g0a118e7
clog BC git tag prod                   -> v0.4.9
clog BC git tag ref                    -> v0.4.9
clog ci mode                           -> dev
```

Four consequences:

1. **Version and production come from git tags, not `releases.yaml`.** `clog BC --help`
   states it outright: "releases.yaml is optional history (a changelog): BC never decides
   from it." Every `yq '.[0].build'` snippet in `.clog.yaml` is dead logic.
2. **`clog BC git tag ref` already works** and does not double the `v`. The broken
   `vv0.4.9` is the *legacy shell override* in `.clog.yaml` shadowing nothing — the Go
   command is a separate namespace. Deleting the override fixes it. `B-13` is moot.
3. **`bc-releases-yaml` reading `clogrc/clog.yaml` is irrelevant.** Nothing in the new flow
   calls it. `B-12` is moot.
4. `clog ci mode` returns `dev` off a release tag and `prod` on one. No `MAKE prod` ceremony.

### How a step resolves

Verified empirically with a throwaway repo:

```
clog BC flow --build "demo"      ->  runs snippet  bc-demo
```

`clog BC flow --check "..." --build "..."` (or `$CHK`/`$MAKE`) maps each token `X` to the
snippet `bc-X`, resolved from clog's **embedded** `konfig.yaml` merged with the repo's
`.clog.yaml`. That is the whole extension mechanism, and it is what decides where new code
belongs:

- **generic worker → clog's `embedfilesystem/konfig.yaml`**, so every repo inherits it
- **repo specifics → pihuw's `.clog.yaml`**

### Workflows are callable, not per-repo

`clog/.github/workflows/build-hugo.yaml` is a `workflow_call` action that already does:
install clog from the `get_clog` secret, event-aware checkout (`push`/`PR`/`schedule`),
optional Cloudflare bypass, `clog install golang hugo ko slsa-verifier`, `clog build`,
Trivy scan, upload `kodata/` + `tmp/` as an artifact, and `clog SlackStash` notification.

`deploy-s3.yaml` is its mirror: it *downloads* that artifact and deploys. **Build and deploy
are separate workflows joined by an artifact.** A Pages deploy must follow the same shape.

## What clog is missing

`embedfilesystem/konfig.yaml` has `snippets.install.*` for aws, docker, gh, golang, hugo,
ko, yq and friends. It has **no GitHub Pages worker and no wrangler/Cloudflare-Pages
install target**, and there is no `deploy-ghpages.yaml` workflow. clog's own `deploy`
snippet names `MAKE="deploy-github"`, but **no `bc-deploy-github` worker exists anywhere**.

pihuw is the first repo to need this, which is why it has a hand-rolled snippet.

## Plan

### A — add generic support to clog

Target branch: see open question 1. clog has no `dev` branch.

1. **`bc-deploy-ghpages`** in `embedfilesystem/konfig.yaml`. Publishes a built directory to
   an orphan branch and configures Pages via `gh api repos/$REPO/pages`. Takes everything
   from env so it stays generic: `$GHP_DIR` (default `kodata`), `$GHP_BRANCH` (default
   `gh-pages`), `$GHP_REPO` (default `clog BC git repo`). Emits
   `DEPLOY-GHPAGES_msg` to the stash like every other worker.
2. **`bc-metadata`** in the same file. Writes the build identity once, from
   `clog BC genBuildinfo`, so sites can render it and deploys can label themselves:
   version, production tag, commit, branch, build time, repo URL. Land it as JSON in
   `tmp/` for the stash *and* as a data file the site can read. This is the "metadata
   support" half and it is what lets pihuw's footer stop reading `releases.yaml`.
3. **`install.wrangler`** in `snippets.install`, mirroring `install.ko`, for the Cloudflare
   target.
4. **`.github/workflows/deploy-ghpages.yaml`**, modelled on `deploy-s3.yaml`: inputs
   `artifact-name`, `make`, `bcTitle`; secrets `get_clog`, `webhook_slack`, `cf_*`;
   downloads the artifact, runs `clog deploy`, notifies Slack.

### B — strip pihuw back

5. **Delete** from `.clog.yaml`: `github-page`, `bc-releases-yaml`, `bc-prod-logic-build`,
   `bc-prod-logic-deploy`, `bc-wants-*-flow`, the `git: tag:` and `git: message:`
   overrides, and the `kfg`/`clog` `releases-path` duplication. Keep `releases-path` once,
   as changelog history only.
6. **Delete `.github/workflows/gh-static.yml`.** Replace with a thin caller of clog's
   `build-hugo.yaml` + `deploy-ghpages.yaml`.
7. **Add to `.clog.yaml`** only what is specific to this repo:
   ```yaml
   clog:
     releases-path: data/releases.yaml     # changelog only; BC ignores it
     stash-path:    tmp/BcStash.yaml
   snippets:
     project:
       config: export PROJECT=pihuw
     build:  export CHK="pre-build build"; export MAKE="hugo metadata";        clog BC flow
     deploy: export CHK="pre-build tools"; export MAKE="deploy-ghpages";       clog BC flow
   ```
8. **`module.yaml` owns the mounts. No symlinks.** `documentation/content -> content` is
   already mounted by the local-dev self-import and a bare clone builds all 77 pages, so
   the symlink is pure cruft. But clog's core `bc-hugo` hard-fails on `[ ! -d content ]`,
   which is *why* the symlink exists. Fix it in clog, not here: `bc-hugo` should test for
   buildable content via `hugo config` or simply let `hugo` fail, so mount-only repos work.
   That is a third clog change and it is the one that finally kills the symlink.

### C — other targets

9. **Container** needs no new work: `clog install ko` and `bc-ko` already exist, and
   `publishDir: kodata` is the ko payload. `MAKE="hugo ko"`.
10. **Cloudflare** becomes `MAKE="hugo deploy-cloudflare"` once `install.wrangler` and a
    `bc-deploy-cloudflare` worker land. Same artifact, different publisher. Worth writing
    at the same time as `bc-deploy-ghpages` so the two share the metadata step.

## Verification

- `clog BC flow --build "hugo"` builds `kodata/` with no symlink present.
- On a release tag, `clog ci mode` returns `prod` and the flow aborts on a failed check.
- `clog BC genBuildinfo` output matches what the footer renders.
- Rehearse the Pages deploy on a scratch fork. It force-pushes an orphan branch.
- Confirm the old `gh-static.yml` is gone before the first run, or both will race the
  `gh-pages` branch.

## Course correction, 2026-09-21

The clog work described in earlier versions of this plan was implemented in
`/home/bruce/gr/0_mrmxf/clog` and has been **reverted**. That repo is `github.com/mrmxf/clog`:
the archived, pre-rename project, last touched "last update before refactor". It does not
build, it has no `BC` command, and nothing consumes it.

The live project is **`/home/bruce/gr/clogs/clog-mrmxf`**, module `github.com/mrmxf/clog-mrmxf`,
sitting in a Go workspace at `/home/bruce/gr/clogs/` alongside `util`, `clog-app`,
`clog-sample` and `utbd`. It is already on a `dev` branch, HEAD
`cb547c8 release: v0.11.14 - BC flow from git + mode`, which is exactly the installed binary.
**It builds cleanly.** There was never a broken clog build to fix; `B-14` was raised against
the archived repo and is withdrawn.

### Why the earlier design was wrong

`util/ci/targets.go` already declares `KindGitHubPages = "github-pages"` alongside
`container-registry`, `bucket` and `cloudflare-pages`. The kinds are declared and validated;
what is missing is a deployer behind them. So GitHub Pages support is **not** a new
`bc-deploy-ghpages` snippet — it is the deployer for an existing target kind, dispatched by
`clog deploy` from a `ci:` data block.

`clog-mrmxf/todo-hugo-sites-config-only.md` (2026-09-19) already sets this out, and two
items bear directly on what I had written:

- item 1 — make `ci.targets.*.kind` do something; deployers move into clog
- item 2 — **fix `bc-hugo` and `bc-ko` in util, then retire them.** My change to `bc-hugo`'s
  `content/` check was patching a worker already slated for deletion.

### What a pihuw target should look like

Following that document's end state, pihuw's `.clog.yaml` should become data, not snippets:

```yaml
ci:
  modes:
    dev:  {base-url: "https://mrmxf.github.io/pihuw/", noindex: "true"}
    prod: {base-url: "https://mrmxf.github.io/pihuw/"}
  targets:
    pages:
      kind: github-pages
      prod: {branch: gh-pages, dir: kodata}
```

Note that document's item 4 also says a site should NOT set both `clog:` and `kfg:`
`releases-path`. pihuw currently sets both; drop the `kfg:` one.

### Open, for the maintainer

1. The `github-pages` deployer belongs in `util` (module `github.com/mrmxf/util`, currently
   on `main`), not in `clog-mrmxf`. That is a third repo and outside anything agreed so far.
2. The suggested order in `todo-hugo-sites-config-only.md` puts `cloudflare-pages` first
   (item 3) and the Hugo build rework next (item 4). GitHub Pages is not in that list at all,
   because pihuw is the first site to need it. Where should it slot in?
3. Everything salvageable from the withdrawn work is saved as a patch and a workflow file in
   this session's scratchpad. The `bc-metadata` worker may still be worth having; the
   `bc-deploy-ghpages` snippet should be rewritten as a kind deployer instead.
