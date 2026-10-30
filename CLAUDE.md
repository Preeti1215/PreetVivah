# CLAUDE.md

Wedding invitation website for Preeti & Vivek (Dec 20–21, 2026, Treasure Island Resort, Lonavala). A static site: no build step, no package manager, no tests. Hosted on GitHub Pages from `main` at the repo root.

## Files

- `index.html` (~1900 lines): the English page, everything. Inline `<style>` (lines ~7–960), an SVG `<symbol>` sprite, the page markup, then one inline `<script>` IIFE (from ~line 1367).
- `hi.html`: the Hindi version, a full copy of `index.html` with Hindi text (see Languages below).
- `apps-script/Code.gs`: Google Apps Script that saves RSVPs into the Google Sheet (not deployed by the site; pasted into the sheet's Apps Script editor).
- `theme.css`: design tokens (colours, fonts, fluid type scale `--step-*`) and shared components (`.label`, `.script`, `.lotus-rule`, `.arch`, `.btn`). Add new colours/sizes here as tokens rather than hard-coding them.
- `images/`: all `.webp`. Prefixes: `ic-*` icons, `story-*` story polaroids, `q-*` quiz art, `wardrobe-*` dress-code cards.
- `aaj_sajeya.mp3`: the background track currently in use. `music.mp3` is an older track and is not referenced anywhere.

## Page structure (in order)

1. `#gate`: envelope/seal splash; `#open-btn` opens the invite (`openGate`).
2. `#invite` hero: names, bike-ride couple, countdown, Calendar / Directions / Upload-memories buttons.
3. `#story`: polaroid carousel.
4. `#itinerary`: two-day schedule (times shown in cornflower).
5. `#wardrobe`: dress code per event (Haldi, Sangeet, Wedding).
6. `#quiz`: couple quiz, driven by the `QUIZ` array in the script.
7. `#rsvp`: form, then a confirmation panel that composes a WhatsApp message.
8. `.closing`, plus the hidden `#host` link maker.

Also: `#petals` canvas animation and the `#music-btn` toggle (plays `MUSIC_SRC`, or a synthesized Web Audio piano if empty).

## Languages (English and Hindi)

**Rule: whenever a change is requested, first confirm whether it applies to the English version (`index.html`), the Hindi version (`hi.html`) or both, before editing.** Do not assume. Applying a change to one page only is fine when asked. A Hindi change must follow the reference card `Wedding_Invitation_Updated_Page2.pdf` (the user's own Downloads copy).

- English is served at the root, Hindi at `hi.html`. Each page has a toggle button (top right) that keeps the current section or guest link.
- `?lang=hi` on the English page redirects to Hindi; `?lang=en` on the Hindi page redirects to English. Shared links look like `https://preeti1215.github.io/PreetVivah/hi.html#for-Riya-and-Family&max=4`.
- The `#host` link maker has a language dropdown that builds the matching link. Guest names can be typed in Devanagari.
- `hi.html` differs from `index.html` beyond text: Devanagari fonts and CSS overrides (no letter-spacing, no gradient-clipped text, which cut off vowel signs), names are not split letter by letter, a Hindi-only "परिवारजन" section (families list from the printed card), Hindi quiz/RSVP strings and a Hindi WhatsApp message. Option `value`s (Train, 20 Dec, 10 AM, yes/maybe/no) stay English so the Google Sheet gets consistent data.
- Both pages share the same script settings and RSVP logic, so a logic change usually needs doing twice.
- Known differences from the printed card, kept as the site's times/names on purpose: the card lists the itinerary with slightly different times and "हल्दी" instead of "कार्निवल"; the card text "सौ. राजकुमारजी सा." is copied as printed.

## Settings (top of the `<script>` in index.html)

- `SITE_URL`: base for personal links; uses `location` automatically except inside claude.ai.
- `RSVP_WHATSAPP`: host number, digits with country code. Empty = guest picks a chat.
- `RSVP_SHEET_URL`: Google Apps Script `/exec` URL; RSVPs are POSTed with `mode: 'no-cors'`. Empty = WhatsApp only. The script to deploy is `apps-script/Code.gs`.
- `PHOTOS_URL`: Google Drive folder for guest photos. Empty = "Photo link coming soon".
- `MUSIC_SRC`: audio path relative to `index.html`.

## Behaviour worth knowing

- Personal greeting: `#for-Riya-and-Family` in the URL becomes "Dear Riya & Family" (`nameToSlug` / `slugToName`), remembered in `sessionStorage`. `#host` shows the link maker.
- The last RSVP is saved in browser storage and restored on reload; all storage access is wrapped in try/catch.
- `prefers-reduced-motion` is respected in both CSS and JS (`reduce`). Keep it that way for new animations.
- The page was originally a claude.ai Artifact, so line 1 carries an injected doctype/head/`<style>` skeleton before the real `<title>`. Leave it alone unless cleaning up the head on purpose.

## Design conventions

Single light theme taken from the printed card: sky watercolour background, ivory paper, bronze foil text, cornflower for times, rose reserved for the reception. Fonts come from Google Fonts: Cinzel (display), Pinyon Script (script), Cormorant Garamond (body), Tiro Devanagari Sanskrit (Hindi). Layout is a single centred column (`--col: 440px`), so design for mobile first.

## Working on it

- Preview: open `index.html` directly, or run `python3 -m http.server` in the repo root (better for audio and fetch).
- Deploy: commit and push to `main`; GitHub Pages refreshes in a minute or two. Live at https://preeti1215.github.io/PreetVivah/.
- After every push, run the `verify-site` skill (`.claude/skills/verify-site/`) to confirm the deploy landed (both `index.html` and `hi.html`) and all assets load.
- Event details (dates, times, venue) appear in several places: hero text, the countdown `target` (~line 1597), the Google Calendar and Maps links, the itinerary, and the RSVP day/time options. Update them all together.
- README.md says to upload a `.nojekyll` file, but it is not in the repo.
