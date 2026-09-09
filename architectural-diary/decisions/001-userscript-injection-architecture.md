# ADR 001 — Deliver the app as a page-injected userscript

- Date: 2024-09-27 (commit `784ff17`)
- Status: accepted

## Context

The access-request workflow is needed while people are working inside
existing internal web tools. Standing up a dedicated portal site would force
context switches and a separate deployment/hosting story for what is,
functionally, a form and a status list.

## Decision

Ship the React app as a Tampermonkey userscript. `userscript.js` (plain
JavaScript, no build step) creates a fixed-position "Access Management"
button and a mount div on any matched page (`@match https://*/*`), then
injects the compiled bundle (`<script src=...>` + `<link rel=stylesheet>`)
from a static host. The React entry (`index.html` / `src/main.jsx`) mounts on
`#access-management`, and `App.jsx` binds to an already-injected
`#access-management-button` when present, falling back to rendering its own
button so the same code runs in dev mode.

## Consequences

- Positive: zero-footprint deployment into arbitrary pages; no routing, no
  portal; the app can be tried on any HTTPS site immediately.
- Positive: dev workflow is a normal Vite app — no userscript tooling needed.
- Negative: the userscript must know a stable bundle URL, which couples it to
  the build output naming (see ADR 002) and the hosting location.
- Negative: broad `@match` and script injection can conflict with host-page
  CSPs and styles; acceptable for a prototype, should be narrowed for real
  use.
