# Changelog

All notable changes to this project are documented here, newest first.
This project adheres to [Conventional Commits](https://www.conventionalcommits.org/).

> **History rewrite note (2026-09-08):** On 2026-09-08 the two original commit
> messages (`yolo`, `dist`) were rewritten in place via a messages-only
> `git filter-branch` to conventional-commit form. File contents, trees, commit
> dates, and authors are byte-for-byte unchanged; only the messages differ.
> Commit hashes changed as a consequence of the rewrite. This changelog uses the
> post-rewrite hashes.

## 2024-09-27 — `2d10956` (full: `2d109568d84f966b0b569682ae8dc597bcfc9a6d`)

### build: commit Vite dist output for userscript hosting

Remove `dist` from `.gitignore` and check in the production bundle so the
Tampermonkey userscript can load the app from a hosted static URL.

- Un-ignore `dist/` in `.gitignore` (line replaced with a blank line).
- Commit compiled production output: `dist/assets/index.js` (bundled React app),
  `dist/assets/index.css`, and `dist/index.html`.
- Makes the bundle available for static hosting, which `userscript.js` expects
  (`https://your-server.com/path/to/assets/index.js` placeholder URL).
- Impact: infra — vendors the build artifact into version control; no source
  behavior changes.

## 2024-09-27 — `784ff17` (full: `784ff173fc74ad326a56653ec35c84bb1727f8cb`)

### feat: scaffold access management React app with mock API

Initial commit: a Vite + React + Tailwind project for an access-management
tool delivered as a page-injected userscript.

- Project scaffolding: `package.json` (pnpm), `pnpm-lock.yaml`, ESLint flat
  config, PostCSS, Tailwind, `vite.config.js` with stable, extension-less asset
  filenames for static hosting.
- UI shell (`src/App.jsx`): fixed "Access Management" button opens a tabbed
  modal ("Add Accesses" / "Track My Requests").
- "Add Accesses" flow: searchable multi-select dropdowns for users and access
  items, default-users applied across accesses, per-access custom
  justifications and notes, warning badges for training/prod-account
  requirements, JSON import/export of the request draft, submission via
  react-query mutation with react-hot-toast feedback.
- "Track My Requests" view: request list with status badges, requester, date,
  and copyable working group.
- Mock data layer (`src/services/api.js`): fake users/accesses with simulated
  latency and ~20% random request failure for demo purposes.
- `userscript.js`: Tampermonkey script that injects a floating trigger button
  and loads the hosted bundle into any page.
- Impact: UI — introduces the complete front-end application in one commit.
