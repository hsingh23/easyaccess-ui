# ADR 003 — Mock the backend behind a single service module

- Date: 2024-09-27 (commit `784ff17`)
- Status: accepted

## Context

This repository is the UI half of an access-management system; the real
backend (user directory, entitlement/role catalog, request workflow) did not
exist yet in usable form. The UI still needed to demonstrate realistic
behavior: search latency, loading states, and submission failures.

## Decision

All data access is confined to `src/services/api.js`, which exports
`getUsers`, `getAccessItems`, `makeRequests`, and `getMyRequests`. The
implementations are in-memory: five mock users, four mock access items
(entitlements/roles, some flagged `requiresTraining` /
`requiresProdAccount`), 500–1000 ms artificial delays, `makeRequests`
marking each request success/failure with ~20% failure probability, and
`getMyRequests` returning three fixed requests spanning approved/pending/
rejected states. Components consume these only through react-query
(`useQuery` / `useMutation`).

## Consequences

- Positive: loading spinners (`CustomDropdown`), disabled-while-submitting
  button, and success/error toasts (`react-hot-toast`) are all exercised by
  the mock, so they will behave correctly against a real API.
- Positive: backend integration is a one-file swap — reimplement the four
  functions against real endpoints, keeping signatures, and no component
  changes.
- Negative: no persisted state — the "Track My Requests" list is static and
  submissions vanish on reload; failure semantics (per-request status with
  `failureReason`) are guesses about the future API shape.
- Note: the mock data embeds example person names (Harsh Singh, William
  Throm, Allison Wei, John/Jane Doe); they are fixture placeholders, not
  real directory data.
