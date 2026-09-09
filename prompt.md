# One-shot recreation prompt — easyaccess-ui

Give the following prompt to a coding agent (with an empty directory) to
recreate this project from scratch. Expected result: a working Vite + React
app matching this repository's source (the committed `dist/` is just the
build output of these sources).

---

Create a React access-management UI meant to be injected into arbitrary pages
as a Tampermonkey userscript. Use Vite + React 18 + Tailwind CSS 3 + pnpm,
with react-tabs, lucide-react, react-query v3, and react-hot-toast. No
routing, no state library; the app is a single modal overlay.

## Project setup

- `package.json` name `access-management-app`, `"type": "module"`, scripts:
  `dev` (vite), `build` (vite build), `lint` (eslint .), `preview` (vite
  preview).
- Dependencies: react ^18.3.1, react-dom ^18.3.1, react-tabs 4.3.0,
  lucide-react 0.244.0, react-query 3.39.3, react-hot-toast 2.4.1. Dev deps:
  Vite 5 + @vitejs/plugin-react, ESLint 9 flat config with react /
  react-hooks / react-refresh plugins, Tailwind 3 + PostCSS + Autoprefixer.
- `vite.config.js`: react plugin; `build.outDir: 'dist'`, `assetsDir:
  'assets'`; rollup output with non-hashed names — `assets/[name].js`,
  `assets/[name].js` chunks, `assets/[name].[ext]` assets (stable URLs for
  the userscript); css postcss config at `./postcss.config.cjs`.
- `index.html` mounts React on element id `access-management`.

## Mock data layer (`src/services/api.js`)

Export async functions with artificial delays (~500–1000 ms):

- `getUsers(query)` — filter mock users by name substring. Users: Harsh
  Singh (harshsingh), William Throm (williamthrom), Allison Wei
  (allisonwei), John Doe (johndoe), Jane Doe (janedoe).
- `getAccessItems(query)` — filter mock items by name or description.
  Items: SUPER_1 "Super Access 1" (Entitlement, requiresTraining),
  SUPER_2 "Super Access 2" (Entitlement, requiresProdAccount), PHDP_1
  "PHDP Role 1" (Role), PHDP_2 "PHDP Role 2" (Role, requiresTraining).
  Each has a one-line description.
- `makeRequests(requests)` — resolve after ~1 s; mark each request
  `success` with ~80% probability else `failure` with reason "Random
  failure for demonstration".
- `getMyRequests()` — return three fixed requests (approved / pending /
  rejected) with user, access {name, description}, requestedAt ISO date,
  and a workingGroup array of names.

## App shell (`src/main.jsx`, `src/App.jsx`)

- `main.jsx`: `ReactDOM.createRoot` on `#access-management`, wrapped in
  StrictMode + `QueryClientProvider` (fresh `QueryClient`) + a bottom-right
  `<Toaster/>` from react-hot-toast.
- `App.jsx`: fixed top-right z-9999 "Access Management" button; also add a
  `useEffect` that binds a click-toggle listener to an existing
  `#access-management-button` (the userscript's) if present. The button
  opens a generic `Modal` containing an `h2` "Access Management" and
  `react-tabs` `Tabs` with two panels: "Add Accesses" and "Track My
  Requests". Import react-tabs base CSS.

## Components (`src/components/`)

- `Modal.jsx` — props `isOpen`, `onClose`, `children`; render nothing when
  closed; fixed full-screen dim overlay (z-50) centering a white rounded
  card (max-w-4xl, scrollable) with an X close button top-right.
- `CustomDropdown.jsx` — searchable select. Props: `options` (objects with
  id/name/description), `value`, `onChange`, `placeholder`, `isMulti`,
  `isLoading`. Click-outside-to-close via ref + document mousedown listener;
  inline search input filtering options by name; multi mode renders selected
  options as removable chips; single mode calls `onChange(option)` and
  closes; spinner (`Loader` icon, animated) while loading.
- `AccessCard.jsx` — one selected access. Shows name, description, red
  warning icon + labels for `requiresTraining` / `requiresProdAccount`,
  rendered note and custom justification when set, and a multi-select
  `CustomDropdown` for "Users for this access". Action buttons (lucide
  icons): note dialog (FileText), custom-justification dialog (Plus),
  remove (X). Both dialogs are nested `Modal`s with a textarea and
  Cancel/Save; edits apply to temp state and commit on Save.
- `AddAccessesTab.jsx` — the request builder:
  - Top-right Export/Import buttons; Export serializes `{ defaultUsers,
    selectedAccesses, businessJustification, customJustifications, notes }`
    to a downloaded `access_requests.json`; Import parses a chosen file
    back into state (with toasts).
  - "Default Users" multi-select (options from `getUsers`) + blue "Apply to
    All" button (UserPlus icon) that copies default users into every
    selected access.
  - "Add Access" single-select dropdown (options from `getAccessItems`);
    picking an option appends `{...access, users: [...defaultUsers]}` to
    the selected list.
  - "Primary Business Justification" textarea prefilled with "I'm a member
    of team X working on project Y and need this to do my job."
  - Scrollable list of `AccessCard`s; each access uses its custom
    justification/note if set, else the primary justification / empty note.
  - Submit button (disabled while no accesses, no justification, or
    mutation in flight) sends
    `requests = selectedAccesses.map(a => ({ access: a, users: a.users,
    businessJustification: custom || primary, note }))` through a
    react-query `useMutation(makeRequests)`; on success toast and clear
    selections/justifications/notes; on error toast.
  - Load initial options with empty-query searches on mount. (Names may say
    "debounced" but no timer is required.)
- `TrackRequestsTab.jsx` — `useQuery('myRequests', getMyRequests)`; spinner
  while loading; per request a bordered card with access name/description,
  colored status badge (green approved, red rejected, yellow otherwise,
  capitalized), "Requested by" and localized date lines, and a "Copy"
  button (Clipboard icon) that writes `workingGroup.join(', ')` to the
  clipboard with a success toast.

Styling: Tailwind utility classes throughout (grays/blue-500 accents, rounded
borders, spacing via `space-y`/`mb`).

## Userscript (`userscript.js`)

Tampermonkey header: name "Access Management System", namespace
tampermonkey.net, version 0.4, description "Implement an access management
system", `@match https://*/*`, `@grant none`. Body: create
`#access-management-root` div on body; create a fixed top-right
`#access-management-button` (z-index 9999, text "Access Management"); append
a script tag loading `https://your-server.com/path/to/assets/index.js` and a
stylesheet link for `.../assets/index.css` (placeholders).

## Finishing

Run `pnpm build` and commit the resulting `dist/` (it is intentionally not
gitignored in this project). Verify: `pnpm lint` clean; dev server shows the
button; both tabs work end-to-end against the mock API.
