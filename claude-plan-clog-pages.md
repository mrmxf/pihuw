# claude-plan-clog-pages.md — adopt the clog build pattern for GitHub Pages

Detail for [CLAUDE.md](CLAUDE.md). Status: **plan only, nothing implemented.**
Drafted 2026-09-21 on `dev`, against clog v0.11.14.

Supersedes the hand-rolled `github-page` snippet in `.clog.yaml`.

## Why

The docs site is published by a bespoke 60-line shell snippet that duplicates what clog's
build-control flow already does, and it is currently broken (`B-05`). Six consumer sites
already use the clog pattern, so pihuw is the odd one out.

## How the clog pattern actually works

Verified by reading `clog/.clog.yaml` and `clog/core/core.clog.yaml`, not from memory.

```
clog Build                      # thin snippet: sets VERB/CHK/MAKE/EXE/TITLE
  └─ clog bc-flowx              # generic driver in core.clog.yaml
       ├─ for TOK in $CHK  : clog Check $TOK
       └─ for TOK in $MAKE : clog bc-$TOK "$doPROD" "$modeMSG"
```

- `$MAKE` is a space-separated list of **worker** names. Core ships `bc-hugo`,
  `bc-golang`, `bc-ko`, `bc-deploy-s3`. A repo adds its own as `bc-<name>`.
- dev-vs-prod comes from the **first entry of `releases.yaml`**: `build: prod` means prod,
  anything else means dev. `clog Should MAKE prod|dev` overrides.
- `bc-hugo` purges and builds into `kodata/`, adding `--buildDrafts --buildFuture
  --buildExpired` when not prod. That matches `publishDir: kodata`.
- Workers append `NAME_msg="..."` lines to `$(clog bc-artifacts)`; `bc-flowx` accumulates
  them into a summary and aborts the run if prod and any step failed.

**There is no `bc-deploy-github` worker anywhere.** clog's own `deploy` snippet names
`MAKE="deploy-github"`, but no such worker is defined in clog core or in clog's repo. This
has to be written; it is the bulk of the work.

## Five blockers, all verified today

| # | Blocker | Evidence |
|---|---|---|
| 1 | `bc-releases-yaml` reads `clogrc/clog.yaml`; pihuw has no `clogrc/` | `clog git tag ref` prints a bare `v`. Every build-control snippet that reads the release state is therefore inert. `B-12`. |
| 2 | `git tag ref` double-prefixes `v` | `ref: echo "v$(yq '.[0].version')"` but versions are stored as `"v0.4.9"`, giving `vv0.4.9`. clog's own repo has the same defect, so fixing it here diverges from clog. `B-13`. |
| 3 | `bc-hugo` hard-requires `content/` | `[ ! -d content ] && clog Log -E "no content/ folder" && exit 1`. Plain `hugo` builds fine without it via the module self-import, but `bc-hugo` will refuse. **This is the real reason the symlink dance exists.** |
| 4 | `github-page` uses `BUILD_DIR="public"` | `hugo.yaml` sets `publishDir: kodata`, so `cd public` fails under `set -euo pipefail`. `B-05`. |
| 5 | `CLAUDE.md` forbids what this adds | "There is no `clog build`/`clog deploy` here — consumer sites define those, the theme does not." That rule has to change, deliberately, as part of this work. |

Blocker 1 must be fixed first; nothing else can be tested until `bc-releases-yaml` resolves.

## Target

```
clog Build                 -> bc-flowx  CHK="pre-build build"          MAKE="hugo"
clog Deploy                -> bc-flowx  CHK="pre-build tools deploy"   MAKE="hugo deploy-ghpages"
```

`kodata/` stays the build output and stays committed (it is the `ko` container payload), so
the deploy worker publishes the *existing* `kodata/` rather than rebuilding.

## Steps

1. **Fix `bc-releases-yaml`.** Override it in pihuw's `.clog.yaml` to read `.clog.yaml`
   itself rather than `clogrc/clog.yaml`. Verify with `clog bc-releases-yaml` printing
   `data/releases.yaml`, then `clog git tag ref` printing a usable tag.
2. **Settle the `v` question (blocker 2).** Either drop the `v` from the `version:` field in
   `data/releases.yaml` and keep the clog-standard `ref`, or override `ref` here to not add
   one. Prefer the first: it matches clog and every other consumer. It rewrites one column
   of a 40-line file and nothing reads `version` except the footer partial and these snippets.
3. **Add `project: config:`** exporting `PROJECT=pihuw`, and a `project: has:/needs:` pair
   for hugo so `clog Check` can gate on the version, reusing core's existing `hugo` probe
   (`hugo config --format yaml | yq -r '.module.hugoversion.min'`).
4. **Decide the `content/` contract (blocker 3).** Either add `ln -s documentation/content
   content` to a pihuw-local `bc-hugo` override with a trap, or drop the module self-import
   mount and commit to the symlink. Do not leave both mechanisms live — that is what made
   the current docs contradict themselves.
5. **Write `bc-deploy-ghpages`.** Port the working half of today's `github-page` snippet:
   orphan-branch creation, `gh api repos/$REPO/pages` configuration, force-push. Change
   `BUILD_DIR` to `kodata`. Emit `DEPLOY-GHPAGES_msg` to `$(clog bc-artifacts)` so
   `bc-flowx` reports it.
6. **Add `build:` and `deploy:` snippets** in clog's shape (`VERB`/`CHK`/`MAKE`/`EXE`/
   `TITLE`, then `clog bc-flowx`).
7. **Retire `github-page`** — keep it as a thin alias to `clog Deploy` for one release so
   consumer muscle memory and any Actions step keep working, then delete.
8. **Update the docs**: `CLAUDE.md` (blocker 5), `claude-build.md`, `claude-deploy.md`, and
   close `B-05` in `claude-backlog.md`.

## Verification

- `clog bc-releases-yaml` and `clog git tag ref` return sane values (step 1 gate).
- `clog Build` with `build: dev` in `data/releases.yaml` produces `kodata/` with drafts.
- `clog Build` with `build: prod` produces `kodata/` without drafts, minified.
- `clog Deploy` against a scratch fork before the real repo. The deploy force-pushes, so
  rehearse it somewhere disposable.
- The existing Actions workflow fires on push to `gh-pages`; confirm the new deploy still
  triggers it rather than racing it.

## Open questions for the maintainer

1. Step 2 — drop the `v` from `releases.yaml`, or diverge from clog's `git tag ref`?
2. Step 4 — symlink, or module mount? Both currently work and they disagree.
3. Should `bc-deploy-ghpages` be contributed upstream to clog core instead? Every consumer
   publishing to Pages needs it, and clog's own `deploy` snippet already names a worker
   that does not exist.
