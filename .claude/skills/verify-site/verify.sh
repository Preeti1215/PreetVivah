#!/usr/bin/env bash
# Verify the live GitHub Pages site (English + Hindi) matches the pushed commit and that every asset loads.
# Usage: verify.sh [timeout_seconds]   (run from the repo root)
set -u
BASE="https://preeti1215.github.io/PreetVivah/"
TIMEOUT="${1:-300}"
fail=0

PAGES="index.html hi.html"   # English (served at the root) and Hindi

for page in $PAGES; do
  url="$BASE"; [ "$page" = "index.html" ] || url="${BASE}${page}"
  local_sum=$(git show HEAD:"$page" | shasum | cut -d' ' -f1)
  echo "Waiting for $url to serve HEAD ($(git rev-parse --short HEAD)) $page..."
  start=$(date +%s)
  while :; do
    live_sum=$(curl -fsS -H 'Cache-Control: no-cache' "${url}?v=$(date +%s)" | shasum | cut -d' ' -f1)
    [ "$live_sum" = "$local_sum" ] && { echo "OK  live $page matches HEAD"; break; }
    if [ $(( $(date +%s) - start )) -ge "$TIMEOUT" ]; then
      echo "FAIL live $page still differs from HEAD after ${TIMEOUT}s (deploy pending or failed)"
      exit 1
    fi
    sleep 15
  done
done

# Every relative src/href in both pages (images, css, audio, the language link), plus the music file.
assets=$( for page in $PAGES; do
            grep -oE '(src|href)="[^"#:]+"' "$page" | sed -E 's/^(src|href)="//; s/"$//'
            grep -oE "MUSIC_SRC = '[^']+'" "$page" | sed -E "s/.*'(.+)'/\1/"
          done | grep -E '^[A-Za-z0-9_./-]+$' | sort -u)   # drop JS template strings like ${src}
for a in $assets; do
  [ "$a" = "./" ] && a=""
  code=$(curl -s -o /dev/null -w '%{http_code}' -I "${BASE}${a}")
  if [ "$code" = "200" ]; then echo "OK  ${a:-./}"; else echo "FAIL ${a:-./} -> HTTP $code"; fail=1; fi
done

# Pretty path without the extension, as used in shared links
code=$(curl -s -o /dev/null -w '%{http_code}' -I "${BASE}hi")
if [ "$code" = "200" ]; then echo "OK  ${BASE}hi (no extension)"; else echo "NOTE ${BASE}hi -> HTTP $code (use hi.html in links)"; fi

[ "$fail" = 0 ] && echo "All checks passed." || echo "Some checks failed."
exit "$fail"
