# ADR 002 — Commit the Vite `dist/` output to the repository

- Date: 2024-09-27 (commit `2d10956`)
- Status: accepted (prototype trade-off)

## Context

The userscript (ADR 001) loads the app by absolute URL from a static host.
The team wanted to share and install the prototype without asking every
consumer to run a Node build chain, and without standing up CI to publish
artifacts.

## Decision

Remove `dist` from `.gitignore` and check in the production bundle
(`dist/assets/index.js`, `dist/assets/index.css`, `dist/index.html`).
Complementarily, `vite.config.js` disables content hashing and pins asset
filenames (`assets/[name].js`, `assets/[name].[ext]`) so the userscript's
hardcoded `assets/index.js` / `assets/index.css` URLs remain valid after
every rebuild.

## Consequences

- Positive: the repo is a self-contained artifact — host `dist/` on any
  static file server and point `userscript.js` at it; no build step on the
  consuming side.
- Positive: stable asset names mean rebuilding never breaks the installed
  userscript.
- Negative: build artifacts live in version control — PRs that change source
  silently drift from `dist/` unless `pnpm build` is rerun and committed;
  review noise from minified diffs.
- Mitigation: after any source change, run `pnpm build` and commit the
  refreshed `dist/` together with the source (documented in `AGENTS.md`).
