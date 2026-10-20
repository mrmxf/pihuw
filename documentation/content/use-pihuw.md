---
title:     Use PiHuW
linkTitle: use pihuw
date:      2026-10-20
weight:    1
menus:     main
summary:   Start your own site with PiHuW — a GitLab repo, the theme, and a copy of these docs to edit.
---

This page takes you from nothing to your own website running on your computer. It
uses a copy of this documentation site as the starting point, so you begin with
working examples of every feature and edit them into your own pages.

Each step has commands to type. Type them in a **terminal**: Terminal on macOS,
any terminal on Linux, or **Git Bash** on Windows (it comes with Git for Windows).
Type each line, then press <kbd>Enter</kbd>.

Wherever you see `YOUR-NAME`, use your GitLab username. Wherever you see `my-site`,
use whatever you want to call your site. Use lower case and dashes, no spaces.

## Before you start — install three tools

You need these installed once. Check each one by typing the command shown:

| Tool | Check with | It should say | Get it from |
|---|---|---|---|
| Git | `git --version` | `git version 2.…` | <https://git-scm.com/downloads> |
| Go | `go version` | `go version go1.…` | <https://go.dev/dl/> |
| Hugo **extended** | `hugo version` | `hugo v0.166.0…+extended` or newer | <https://gohugo.io/installation/> |

Hugo must be the **extended** edition, version **0.166.0 or newer**. If `hugo version`
does not show `+extended`, install the extended one. Go is needed because Hugo uses it
to download the theme.

If a check says `command not found`, that tool is not installed yet. After you
install something, close the terminal and open a new one, so it finds the new tool.

## Step 1 — create a blank project on GitLab

1. Sign in at <https://gitlab.com>. Make a free account first if you do not have one.
2. Click the **+** button at the top of the left sidebar, then **New project/repository**.
3. Click **Create blank project**.
4. In **Project name**, type `my-site`.
5. Under **Visibility Level**, pick **Private** (only you) or **Public** (anyone can see it).
6. Leave **Initialize repository with a README** ticked.
7. Click **Create project**.

GitLab shows your new project. Its web address is `https://gitlab.com/YOUR-NAME/my-site`.

## Step 2 — copy the project to your computer

This is called **cloning**. It makes a folder on your computer that is linked to your
GitLab project.

1. On your project page in GitLab, click the blue **Code** button.
2. Under **Clone with HTTPS**, click the copy icon.
3. In your terminal, go to the folder where you keep projects, then clone and enter
   the new folder:

```sh
git clone https://gitlab.com/YOUR-NAME/my-site.git
cd my-site
```

You are now inside `my-site`. Every command from here on is typed in this folder.
If you close the terminal, `cd` back into it before carrying on.

## Step 3 — load the PiHuW theme

{{<pihuw>}} is a Hugo **module**: rather than copying the theme's files into your
project, Hugo downloads it and keeps track of which version you use.

**3a.** Turn your folder into a Hugo module. This creates a file called `go.mod`:

```sh
hugo mod init gitlab.com/YOUR-NAME/my-site
```

**3b.** Make your site's settings file. Create a file called `hugo.yaml` in the
`my-site` folder with any plain text editor, and put this in it:

```yaml
baseURL: https://YOUR-NAME.gitlab.io/my-site/
title: My Site

module:
  imports:
    - path: github.com/mrmxf/pihuw

markup:
  goldmark:
    renderer:
      unsafe: true
```

- `baseURL` is where your site will live on the web. The address above suits GitLab
  Pages; change it later if you host somewhere else.
- `title` is shown at the top of every page. Change it to your site's name.
- `module` is what tells Hugo to use {{<pihuw>}}.
- `markup` lets your pages contain HTML as well as markdown. The pages you copy in
  the next step need it.

Indentation matters in YAML. Use spaces, never tabs, and line things up exactly as
shown.

**3c.** Download the theme:

```sh
hugo mod get github.com/mrmxf/pihuw@latest
```

To check it worked, look in `go.mod`. It now has a line like
`require github.com/mrmxf/pihuw v0.4.22`. That version number is the theme
version you are using — you need it in the next step.

## Step 4 — start from a copy of this documentation site

The documentation site you are reading lives in the `documentation/` folder of the
{{<pihuw>}} repository. You will download it and copy it into your site.

**4a.** Download {{<pihuw>}} into a temporary folder next to `my-site`. Use the
**same version** that is in your `go.mod` — here `v0.4.22`. Replace it with yours:

```sh
git clone --depth 1 --branch v0.4.22 https://github.com/mrmxf/pihuw.git ../pihuw-copy
```

The version has to match, because these pages show off theme features. Pages from a
newer theme may use features your version does not have yet.

**4b.** Copy the documentation site into your project:

```sh
cp -r ../pihuw-copy/documentation/* .
```

The dot at the end means "here". You now have four new folders:

| Folder | What it holds |
|---|---|
| `content/` | the pages — one markdown file per page |
| `static/` | files served exactly as they are, such as the favicon |
| `assets/` | files Hugo processes, such as the logo in `assets/brand/logo.png` |
| `data/` | data that some pages read, such as the slides for the hero slider |

**4c.** Delete the temporary folder. You do not need it any more:

```sh
rm -rf ../pihuw-copy
```

**4d.** See your site:

```sh
hugo server
```

Hugo prints a line like `Web Server is available at http://localhost:1313/my-site/`.
Open that address in your web browser — it is a copy of this site, running on
your computer.

Leave `hugo server` running while you work. When you save a change to any file, the
page in your browser updates by itself. To stop it, press <kbd>Ctrl</kbd>+<kbd>C</kbd>
in the terminal.

## Save your work to GitLab

Your site exists only on your computer until you send it to GitLab.

**First,** tell Git to ignore the files Hugo makes for itself. Create a file called
`.gitignore` (the name starts with a dot) in `my-site`, containing:

```text
public/
resources/_gen/
.hugo_build.lock
```

**Then** save a snapshot and send it to GitLab:

```sh
git add .
git commit -m "Start my site from the PiHuW docs"
git push
```

If `git push` asks for a username and password, type your GitLab username. For the
password, use a GitLab **personal access token**, not your GitLab password: make one
in GitLab under your avatar, **Edit profile → Access tokens**, with the
`write_repository` scope ticked.

Reload your project page on GitLab and your files are there. Repeat the `git add`,
`git commit`, `git push` lines whenever you want to save again.

## What next

- Change `content/_index.md` — that is your home page.
- Delete the folders in `content/` you do not want. They are only examples.
- Change `title` in `hugo.yaml`, and replace `assets/brand/logo.png` with your own
  logo. A `logo.png` or `logo.svg` in that folder is found automatically; if you
  have both, the `.svg` wins. Keep your logo in `assets/`, not `static/`:
  {{<pihuw>}} can only resize a logo in `assets/`, which keeps every page small.
  If you give it a different name, set it in `hugo.yaml` under `params:`, `ui:`,
  `logo:` — for example `logo: /brand/my-logo.png`.
- Read [Learn](/learn/) for how {{<pihuw>}} sites are put together, and
  [Building](/learn/building/) for publishing your site to the web.
- To move to a newer theme version later, run `hugo mod get github.com/mrmxf/pihuw@latest`
  again.
