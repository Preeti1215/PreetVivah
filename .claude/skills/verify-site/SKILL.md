---
name: verify-site
description: Verify the live wedding site at https://preeti1215.github.io/PreetVivah/ after pushing an update. Use after every push to main, or when asked to check, verify or test the live site.
---

# Verify the live site

The site is served by GitHub Pages from `main` (repo root) of `Preeti1215/PreetVivah`. Hosting an update means committing and pushing to `main`; Pages redeploys in about a minute.

After every push:

1. Run `bash .claude/skills/verify-site/verify.sh` from the repo root (optional arg: timeout in seconds, default 300). It:
   - polls until the live `index.html` and `hi.html` (Hindi) are each byte-identical to `HEAD`, which proves the deploy landed,
   - requests every relative `src`/`href` in both pages plus `MUSIC_SRC`, and fails on any non-200; it also reports whether the extensionless `/hi` path works.
2. If the change was to visible text, also `curl -s` the changed page (`.../PreetVivah/` for English, `.../PreetVivah/hi.html` for Hindi) and grep for the new wording.
3. If a browser tool is available (Claude in Chrome or the built-in browser), open the site, tap the seal to open the gate, and screenshot the changed section at phone width.
4. Report results plainly: which checks passed, any FAIL lines verbatim, and anything not checked (e.g. no visual check).

If the deploy never matches: check that the commit was pushed (`git status -sb` shows no "ahead"), then the repo's Actions tab ("pages build and deployment") for a failed build.
