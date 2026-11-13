# Release rule

Every change to the app (code, UI or behaviour) must increase the version:

1. Bump the patch number in `package.json` (e.g. 1.0.24 → 1.0.25).
2. Add a README changelog entry headed with that version.
3. Run `npm run build`; it regenerates `data/schema.js`, `starters/` and the single-file `download/index.html`. Commit the generated files too.

Checks: `npm run check` (syntax) and `npm test` (core round trips, sandboxed frame, browser flow with Supabase mocked). No ROM is needed.
