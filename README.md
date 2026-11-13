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

- **1.0.56** Studio: a keyboard button in the top bar opens the shortcut list (still “?” too), and the hover tooltips of the studio buttons show their key (e.g. ดินสอ (P), ย้อนกลับ (Ctrl+Z)). Tooltips keep short key hints and still drop long Thai explanations.
- **1.0.55** Studio keyboard shortcuts: Ctrl/Cmd+Z / Y / Shift+Z (undo, redo), C / X / V (copy, cut, paste glyph), S (save); arrow keys shift the glyph by one pixel (when the grid is focused by keyboard they still move the drawing cursor); P / E / F / I tools, 1–4 colours, H / V flip, Delete clears the glyph, [ ] or PageUp / PageDown previous / next glyph, G grid, ? lists them.
- **1.0.54** Studio: the second row of buttons under the colours is merged into the toolbar above the canvas (move ←→↑↓, flip, copy, paste now sit next to the display toggles). “Clear glyph” uses a trash icon instead of the plain X and sits right after the eraser.
- **1.0.53** Removed the “คืนฟอนต์ตั้งต้นที่ลบไป” button from the library; a deleted starter font stays deleted (a modified one can still be reset from its ⋯ menu).
- **1.0.52** Studio: Ctrl/Cmd+click picks several characters in the character list (ticked thumbnails and a “เลือก N อักษร” bar with “ลบที่เลือก” and “ยกเลิก”; the glyph being edited counts as the first pick, once a selection is open a plain click toggles too, Esc clears it). One confirmation deletes them all and the delete is undoable.
- **1.0.51** “เพิ่มอักษร” sheet: button “เติม A–Z a–z 0–9 ให้เข้ากับฟอนต์อัตโนมัติ” fills only the missing Latin letters and digits, aligned to the font's Thai baseline, with the same shadow direction when the font has a shadow, and spacing set from the ink edge (undoable).
- **1.0.50** “เพิ่มอักษร” sheet: quick chips for A–Z, a–z, 0–9 and punctuation, with a switch (on by default) that fills each new glyph with the pixels of the bundled public-domain 8×16 font (resized to the font's cell, editable afterwards); off gives blank glyphs. Works for every font, including the four older built-ins that had no Latin letters.
- **1.0.49** New built-in starter font “ไทยพิกเซล · Manop 8×16” (179 glyphs: 44 consonants, vowels and tone marks, Thai and Arabic digits, ASCII; one colour, no shadow; for every 8×16 console: GB, GBC, WS, NES, SNES, GG, SMS, MD, MCD, PCE, NGP, 2600). Based on the public-domain `manop/thai8x16.bdf` from TLWG thaixfonts (Manop Wongsaisuwan), moved to fit 16 rows (body rows 6–13). The checker now allows leading vowels and digits down to row 13 (was 12).
- **1.0.48** Smaller status dot on the cloud icon (6 px, 7 px in the sidebar/sheets) with a proportionally smaller glow.
- **1.0.47** The status light has no dark ring around it, only the glow.
- **1.0.46** The cloud status light is a neon glow with a slow pulse (green saved, orange pending/syncing, red error); grey stays still.
- **1.0.45** Removed the version text from the sidebar footer (the version is in Settings → About).
- **1.0.44** Shorter cloud messages (“ติดต่อคลาวด์ไม่ได้”, “ยังไม่ได้ติดตั้ง SQL บนคลาวด์”); colour toggle only at the top right (removed from the sidebar footer); on wide screens the top-bar Import / New icons are hidden because the sidebar has them (kept on phones).
- **1.0.43** Sidebar (wide screens): quick New / Import buttons, recent fonts, per-console filters with counts, cloud status, theme toggle and version at the bottom. New Settings tab (also in the mobile tab bar): colour mode (system/light/dark), cloud auto upload and sync, default console for new fonts, local data (usage, clear), shortcuts, about / licences.
- **1.0.42** Removed the separate “เพิ่มฟอนต์ตั้งต้น” row; starters are chosen only through “ตั้งเป็นฟอนต์ตั้งต้น” in a font's ⋯ menu (the starter group shows only when it has fonts).
- **1.0.41** Any font can become a starter font (card menu “ตั้งเป็นฟอนต์ตั้งต้น” or “เพิ่มฟอนต์ตั้งต้น” to import a `.fontlab.json`); starters are listed in their own group and a new font can start from one (“จากฟอนต์ตั้งต้น”, resized to the chosen console). The explanatory footnote under the starter group was removed.
- **1.0.40** Offline mode: `sw.js` precaches the app and serves the cache only when the network fails (network-first, always revalidated, so online users never see stale files); Supabase and `version.json` are never intercepted; older `?v=` copies are pruned; leftover workers/caches from the removed app are still cleared.
- **1.0.39** Missing features: delete / rename / reorder glyphs (one undo step each, also for add); new font from a .ttf/.otf/.woff file (rasterised with the browser text engine, marks isolated from their base letter); game text-box preview (console screen width, wrapping, frame); keyboard drawing (arrows, Space/Enter, Backspace) with a live position announcement; glyph list renders in chunks of 240.
- **1.0.38** iOS polish (part 1): form sheets get a header bar (Cancel · title · primary action) and can be swiped down; softer focus ring; studio has a back button and a “more” menu (settings, export); long-press / right-click on a font card opens its menu; console rules as inset lists; larger small text; sticky glyph column and wider cards on desktop.
- **1.0.37** The four big buttons under the glyph list (shadow, auto spacing, check, add glyph) became an iOS-style inset list: icon, title with a short description, chevron, hairline separators.
- **1.0.36** Fixed a layout regression from 1.0.35: an unclosed tools-row `div` pushed the glyph list below the canvas on wide screens. Tests now check that the studio has two columns with the glyph list beside the canvas and that its markup is balanced.
- **1.0.35** Guide lines are single dashed lines again (no halo, no doubled stroke; colour black/white by palette; baseline solid). New tag button after the ruler: faint zone names inside the canvas (วรรณยุกต์ · สระบน / พยัญชนะ / สระล่าง · หาง, and “ห้ามใช้” on rows the glyph class must not use). Remembered; turning it on also turns the guides on.
- **1.0.34** Guide lines are single solid lines (no dashes, no halo): colour is black or white depending on the console palette, the advance line is 3 px with an arrow, the baseline 3 px, the top/body boundary 2 px.
- **1.0.33** Clearer guide lines in the studio: the advance line and zone boundaries are thicker, use the theme colour with a contrasting halo (visible on any console palette) and the advance line has an arrow marker.
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
