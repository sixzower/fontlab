# FontLab

iOS-style web app for making bitmap fonts for emulated games: 25 consoles with their real tile formats, a pixel studio with Thai drawing guides, per-console starter files and automatic, login-free cloud backup.

**Run:** open `index.html`, or `npm run dev` and visit http://localhost:5173/. `download/index.html` is the same app as one self-contained file.

## Layout

| Path | What |
|---|---|
| `index.html`, `manifest.webmanifest` | the app shell |
| `src/` | `core.js` (console formats, project model, import/export), `app.js` (UI), `cloud.js` (backup), `config.js` (public Supabase URL + publishable key), `fontlab.css` |
| `data/` | `fonts.js` built-in Thai fonts (read-only in the app), `schema.js` (generated from `sql/fontlab.sql`) |
| `starters/<console>/` | blank and Thai-base `.fontlab.json`, sheet PNG, `.bin` and README per console (generated) |
| `icons/` | logo and app icons; `options/` holds the logo candidates |
| `sql/fontlab.sql` | the Supabase setup, run once in the SQL Editor |
| `scripts/`, `tests/` | `build-*.cjs` generators; `core`, `sandbox`, `browser` tests |
| `fonts/` | Prompt font (OFL) for Thai text |

`npm run build` regenerates the generated files, `npm run icons` the icons, `npm test` runs everything (Chromium via Playwright).

## Cloud backup

No accounts. The browser makes a random backup code and saves every user font to Supabase a moment after each change; paste the code on another device to pull the same fonts (newest copy wins). Only the code's SHA-256 is stored, so treat the code like a password. Setup: run `sql/fontlab.sql` once; put the project's URL and **publishable** key in `src/config.js` (never a secret/service key). Built-in fonts are never uploaded; each code holds up to 500 fonts of 2 MB.

## Drawing zones (16 px cell)

Rows 0–5 tone marks and upper vowels · 6–12 consonant body (baseline under row 12) · 13–15 lower vowels and descenders. Other heights scale; cells under 12 px are flagged. The studio shades rows a character must not use and lists glyphs that exceed them.

## Changelog

- **1.0.32** Cloud upload is manual by default: edits are kept in the browser and the cloud dot turns orange (“not on the cloud yet”); pressing save (or “add as new font”, or “sync now”) uploads. Page load only pulls newer fonts and never pushes. Auto upload after edits is an opt-in switch in the cloud sheet.
- **1.0.31** Undo/redo moved from the top bar to the tools row under the canvas; guides use quiet greys (tinted mark/lower zones, hatched forbidden rows, thin baseline) instead of orange/green/purple/red bands.
- **1.0.30** iOS-style tooltips on every icon-only button (hover or keyboard focus), with the short name only.
- **1.0.29** Starter fonts are ordinary fonts (edit, add glyphs, delete, restore, reset to original). Thai vowel and tone marks now overlay the previous letter instead of taking their own cell. Icon-only save button plus “add as new font” (Save As) that does not overwrite the original.
- **1.0.28** Visible save: a “บันทึก” button and a live “saved locally / on the cloud” line in the studio. Auto spacing (advance = ink right edge + gap) for one glyph or the font, one undo step. Exports a `-widths.bin` advance table (also in the zip) and an ADV column in the README.
- **1.0.27** Shadow sheet can also remove every shadow pixel (current glyph or whole font, one undo step).
- **1.0.26** Automatic shadow (studio → “เพิ่มเงาอัตโนมัติ”): casts index-2 shadow pixels from the ink in one of four directions, for one glyph or the whole font, never over existing pixels or outside the cell; widens the advance when a shadow lands past it; one undo step.
- **1.0.25** Full-width layout; the page checks `version.json` on load and moves itself to a newer version (no more Ctrl+Shift+R); leftovers of the old app's service worker and caches are removed; assets carry `?v=<version>`.
- **1.0.24** Repository reduced to FontLab only and reorganised (`src/`, `data/`, `icons/`, `sql/`). The earlier ROM translation workspace and patch site were removed; their last version is commit `6da4962` on `main`.
- **1.0.23** Points to the live Supabase project; live round trip verified.
- **1.0.22** Automatic backup with a backup code; Cloud tab and email login removed.
- **1.0.21** 25-console icon menu; Thai drawing zones and out-of-bounds checker.
- **1.0.20** Pencil logo chosen; 1.0.19 sandbox fix and tab order; 1.0.18 white theme, light/dark switch, iOS menus; 1.0.17 logo and single file; 1.0.16 first FontLab release.
