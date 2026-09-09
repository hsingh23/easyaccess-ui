# Architectural diary — easyaccess-ui

A narrative history of how this repository's architecture came to be, written
after the fact from the git history (the code predates this diary; see
`CHANGELOG.md` for the commit-level view). Decisions are recorded as numbered
ADRs in `decisions/`.

## Origin (2024-09-27): one-shot prototype

The entire application landed in a single commit (`784ff17`, originally
messaged `yolo`): a Vite + React + Tailwind scaffold, a five-component UI, a
mock service layer, and a Tampermonkey userscript — 20 files, ~4,500 lines
including the lockfile. There is no intermediate history to reconstruct intent
from; the diary therefore reads the design out of the code itself.

## Shape of the system

The defining architectural choice is **where the app runs**: not at its own
URL, but inside other people's pages. `userscript.js` runs under Tampermonkey,
creates a floating trigger button and a mount node, and loads the compiled
bundle from a static host. The React app is deliberately self-contained: a
single modal, no routing, no external state library, everything wrapped in
`QueryClientProvider` for server state and local hooks for draft state
(decision 001).

## The request-builder model

`AddAccessesTab` implements a two-level editing model:

1. **Global defaults** — a default-users multi-select and a primary business
   justification, applied to every access unless overridden.
2. **Per-access overrides** — each `AccessCard` carries its own user list, an
   optional custom justification, and an optional note, edited through nested
   `Modal` dialogs with temporary state that is committed on save.

The whole draft (defaults + selected accesses + overrides) is serializable to
JSON for export/import — an implicit "save and resume / share for review"
mechanism that costs nothing to implement because all state is plain data.

## Data layer

All backend interaction goes through four functions in
`src/services/api.js` (`getUsers`, `getAccessItems`, `makeRequests`,
`getMyRequests`) backed by in-memory arrays, simulated latency, and a random
~20% submission failure (decision 003). This keeps every UI concern —
loading spinners in `CustomDropdown`, mutation states in the submit button,
error toasts — exercised from day one, so swapping in a real API later is a
one-file change.

## Shipping without infrastructure

The second commit (`2d10956`, originally `dist`) un-ignored `dist/` and
committed the production bundle (decision 002). The vite config cooperates: it
disables content hashing and forces `assets/index.js` / `assets/index.css`
names so the userscript's hardcoded script URL survives every rebuild. The
trade-off — vendored build artifacts in git — was accepted to make the
prototype installable with nothing but a static file host.

## Where this leaves the project

The codebase is a complete UI prototype with three deliberate gaps: the
backend is mock, the userscript's hosting URLs are placeholders, and the
`@match` pattern is `https://*/*`. Natural next steps, none taken yet, would
be: pointing `src/services/api.js` at a real backend, narrowing the userscript
match pattern, and adding a test suite.
