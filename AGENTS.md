# AGENTS.md — working guide for coding agents

Practical instructions for making changes to this repository safely and in
keeping with its design.

## Commands

```bash
pnpm install        # install dependencies (lockfile: pnpm-lock.yaml)
pnpm dev            # Vite dev server with HMR
pnpm build          # production build -> dist/
pnpm preview        # preview the production build
pnpm lint           # ESLint (flat config in eslint.config.js)
```

There is no test suite and no CI in this repository.

## Architecture map

The app is an **injectable overlay**, not a standalone site:

```
userscript.js                    (runs in Tampermonkey on any page)
  └─ creates #access-management-button + #access-management-root
  └─ loads hosted dist/assets/index.js + index.css

dist/assets/index.js             (built from src/)
  └─ src/main.jsx                React root on #access-management
      QueryClientProvider + <Toaster/>
      └─ src/App.jsx             floating button -> tabbed modal
          ├─ AddAccessesTab.jsx  request builder
          │   ├─ CustomDropdown  searchable single/multi select
          │   └─ AccessCard      per-access users/note/justification
          │       └─ Modal       note + justification dialogs
          └─ TrackRequestsTab.jsx  status list (react-query useQuery)
src/services/api.js              mock API: getUsers, getAccessItems,
                                makeRequests, getMyRequests
```

Key mechanics:

- **Entry point id**: `index.html` mounts React on `#access-management` (not
  `#root`); `src/App.jsx` also attaches a click listener to a button with id
  `access-management-button` if one already exists (the userscript-injected
  one), otherwise renders its own.
- **Server state** lives in react-query; draft state (selected accesses,
  justifications, notes, default users) is local `useState` in
  `AddAccessesTab`.
- **Mock data** in `src/services/api.js` simulates 500–1000 ms latency and a
  ~20% random failure on `makeRequests`.
- **Build output naming**: `vite.config.js` forces extension-less, non-hashed
  asset names (`assets/index.js`, `assets/index.css`) so the userscript's
  hardcoded URLs stay stable across builds.

## Conventions

- Plain JSX function components with hooks; default exports for components.
- Tailwind utility classes inline; global styles only in `src/index.css` /
  `src/App.css` (minimal).
- Data access only through `src/services/api.js` — components never hold mock
  data inline. To integrate a real backend, replace the implementations in
  that one file and keep the exported function signatures.
- Conventional Commits (`feat:`, `fix:`, `build:`, ...); imperative subject
  lines ≤ 72 characters, body explaining the why and what.

## Gotchas

- **`dist/` is committed on purpose** (decision 002). Do not re-add it to
  `.gitignore` or delete it without updating `userscript.js` hosting; the
  userscript depends on the hosted bundle. After source changes, run
  `pnpm build` and commit the refreshed `dist/`.
- **`userscript.js` contains placeholder URLs** (`https://your-server.com/...`)
  that must be edited to the real hosting location. Keep them placeholders in
  the repo; never commit real internal hostnames.
- **`framer-motion` is declared in `package.json` but unused** by any
  component — don't assume it is load-bearing.
- **Debounce is only nominal**: `debouncedSearchUsers` /
  `debouncedSearchAccesses` in `AddAccessesTab.jsx` are named "debounced" but
  have no timer logic — the mock API filters client-side anyway.
- The userscript `@match https://*/*` is intentionally broad for the
  prototype; narrow it for real deployments.
- Sibling repositories `easy` / `easy2` exist next to this one; nothing in
  this codebase imports or references them.

## Verifying changes

1. `pnpm lint` passes.
2. `pnpm dev` — the page shows the floating **Access Management** button; the
   modal opens with both tabs; user/access search dropdowns filter; adding an
   access creates an `AccessCard`; note/justification dialogs save; Export
   writes `access_requests.json` and Import restores it; Submit shows a toast
   (occasionally a failure toast — that is the mock).
3. `pnpm build` — confirm `dist/assets/index.js` and `dist/assets/index.css`
   exist with the expected names.

## Pointers

- Decision records: `architectural-diary/decisions/` (001 userscript
  architecture, 002 committed dist, 003 mock service layer).
- Recreate-from-scratch prompt: `prompt.md`.
- History: `CHANGELOG.md`.
