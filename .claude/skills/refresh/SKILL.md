---
name: refresh
description: Refresh the local copy of the wedding site. Pulls the latest from GitHub (git pull) and checks everything is up to date and still valid. Use when asked to refresh, sync, update to latest, or pull.
---

# Refresh the local site

Brings the local repo up to date with `origin/main` and confirms nothing is broken. Run everything from the repo root (`/Users/varsharanka/workspace/PreetVivah`).

1. **Check local state:** `git status -sb`. Untracked `.DS_Store` is ignorable. If there are uncommitted changes to tracked files, do not discard them: tell the user, and use `git pull --rebase --autostash` instead of a plain pull.
2. **Pull:** `git fetch origin` then `git pull --ff-only origin main` (or the autostash variant above). If the pull is not a fast-forward or hits conflicts, stop and report the conflicting files. Do not reset, force, or resolve them without asking.
3. **Show what changed:** `git log --oneline ORIG_HEAD..HEAD` (or say "already up to date") and `git diff --stat ORIG_HEAD..HEAD` when something came in.
4. **Verify:** run `bash .claude/skills/verify-site/verify.sh --local` (scripts parse, `RSVP_SHEET_URL` set, assets exist). Report any FAIL verbatim.
5. **Confirm sync:** `git status -sb` should show no "ahead" or "behind". If the local branch is ahead, say so (unpushed commits); do not push unless asked.
6. **Report plainly:** commits pulled (or already up to date), whether verify passed, and anything left unresolved. Mention if `index.html` or `hi.html` changed, since the two pages are kept in sync by hand.

This skill only pulls and checks; it does not edit the site, commit, or push.
