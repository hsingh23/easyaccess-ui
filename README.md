# easyaccess-ui

A React-based **access management** user interface designed to be injected into
any web page as a Tampermonkey userscript. A floating "Access Management"
button opens a tabbed modal where users can request access (entitlements and
roles) for one or more people and track the status of their requests — without
leaving the page they are already working in.

The repository contains the UI only; all data comes from a mock service layer
(`src/services/api.js`) with simulated latency and failures, ready to be
swapped for a real backend.

## Why

Enterprise tools often bury access request forms in a separate portal, so
requesting an entitlement means context-switching, re-typing justifications,
and losing track of what was requested. This project prototypes a better
shape: the request workflow travels with you as a userscript overlay, supports
bulk requests with per-access justifications, and lets you export/import an
in-progress request draft as JSON (e.g., to share with a manager before
submitting).

## Features

- **Injected overlay UI** — Tampermonkey userscript (`userscript.js`) adds a
  floating button on any matched page and loads the hosted React bundle.
- **Add Accesses tab**
  - Searchable, multi-select dropdowns for users and access items.
  - Default-users list with "Apply to All" to seed every request.
  - Primary business justification plus optional per-access custom
    justification and free-text note (edited in dialogs).
  - Warning indicators for accesses that require training or a production
    account.
  - Export the current draft to JSON and re-import it later.
  - Submit all requests at once with success/failure toasts.
- **Track My Requests tab** — request cards with status badge
  (approved/pending/rejected), requester, request date, and a copy-to-clipboard
  working-group list.
- **Mock API** — in-memory users and access items, simulated network delay,
  and ~20% random submission failure to exercise error handling.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 5 (`@vitejs/plugin-react`), pnpm |
| UI | React 18, react-tabs, lucide-react icons |
| Styling | Tailwind CSS 3 + PostCSS/Autoprefixer |
| Server state | react-query (TanStack Query v3) |
| Notifications | react-hot-toast |
| Delivery | Tampermonkey userscript loading a statically hosted bundle |

## Quickstart

```bash
pnpm install     # install dependencies
pnpm dev         # dev server with HMR (see terminal for URL)
pnpm build       # production build into dist/
pnpm preview     # serve the production build locally
pnpm lint        # ESLint over the project
```

### Using it as a userscript

1. Build the app (`pnpm build`) and host `dist/` at a static URL.
2. Edit `userscript.js` to point the `script.src` / `link.href` placeholders
   (`https://your-server.com/path/to/assets/index.js` and `.../index.css`) at
   your hosted bundle.
3. Install `userscript.js` in Tampermonkey and browse to any matched page
   (`@match https://*/*`).
4. Click the floating **Access Management** button.

For local development you don't need the userscript: the dev build renders the
same button and modal directly.

## Repository structure

```
├── index.html                  # Vite entry (mounts #access-management)
├── userscript.js               # Tampermonkey injector for the built bundle
├── vite.config.js              # Build config; stable asset filenames
├── dist/                       # Committed production bundle (see decision log)
└── src/
    ├── main.jsx                # React root + QueryClientProvider + Toaster
    ├── App.jsx                 # Floating button + tabbed modal shell
    ├── services/api.js         # Mock API (users, accesses, requests)
    └── components/
        ├── AddAccessesTab.jsx  # Request-builder tab
        ├── TrackRequestsTab.jsx# Request-status tab
        ├── AccessCard.jsx      # Per-access card (users, notes, justification)
        ├── CustomDropdown.jsx  # Searchable single/multi select
        └── Modal.jsx           # Generic overlay modal
```

## Environment variables

None. The app defines no environment variables; the only external dependency
is the hosted-bundle URL hardcoded in `userscript.js` (a placeholder).

## Documentation

- [`CHANGELOG.md`](CHANGELOG.md) — commit-by-commit history
- [`AGENTS.md`](AGENTS.md) — working guide for coding agents (commands,
  architecture, conventions, gotchas)
- [`architectural-diary/`](architectural-diary/) — how the design evolved and
  why, including numbered decision records
- [`prompt.md`](prompt.md) — one-shot prompt that recreates this project from
  scratch
