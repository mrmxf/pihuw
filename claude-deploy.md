# claude-deploy.md — deploy

Detail for [CLAUDE.md](CLAUDE.md). Build is in [claude-build.md](claude-build.md).

This deploys the **documentation site** to GitHub Pages. The theme itself ships as a Hugo
module — consumers get it from a git tag, so there is nothing to deploy for that.

## Commands

```bash
clog github-page      # build + force-push to the gh-pages branch. Needs gh CLI.
```

Idempotent: it creates the orphan `gh-pages` branch and configures Pages on first run.
`GH_TOKEN` or `GITHUB_TOKEN` must be set; it never prompts for a login.
Runs the same locally and as an Actions step.

## Facts

- Target is `mrmxf/pihuw` → https://mrmxf.github.io/pihuw — hardcoded in the snippet.
- `git push --force` to `gh-pages`. That branch has no history worth keeping.
- The snippet symlinks `content`, builds, and removes the link in a trap, so a failed
  build cannot leave a stale symlink behind.
- `.github/workflows/gh-static.yml` fires on push to `gh-pages`, so `clog github-page`
  triggers the workflow rather than replacing it.
- The workflow builds with `--minify --baseURL <pages base_url>` and uploads via
  `actions/upload-pages-artifact@v3`.

## Two known breaks — see [claude-backlog.md](claude-backlog.md)

- The snippet assumes `BUILD_DIR="public"` but `hugo.yaml` sets `publishDir: kodata`.
- The workflow pins `HUGO_VERSION: 0.159.0`, below the required 0.161.0.
