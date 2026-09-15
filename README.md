# Geo Adventures — component architecture

Rebuilt from the original single-file prototype into the structure below.
Behavior and visual design are unchanged; the app now loads through real
ES modules, so **serve it over HTTP** rather than opening `index.html`
directly (`file://` blocks module imports in most browsers):

```
cd geo-adventures
python3 -m http.server 8080     # or: npx serve .
# open http://localhost:8080
```

## Layout

```
index.html                 SPA shell — <link> tags + <script type="module" src="src/app.js">
styles/
  tokens.css                variables, reset, base type, layout primitives
  utilities/buttons.css      buttons, pills, filters, toggles, currency switcher
  components/                header, hero, card (+ shared modal), booking, footer, toast
  dashboard/                  sidebar/bottom-nav, stat cards, admin shell/tables/forms
src/
  app.js                     route dispatch + all delegated event wiring (the kernel)
  router.js                  hash parsing (#/route/id?query=..) + change subscription
  pages/                     one file per route, composes components + reads data
  components/                pure render functions (public + components/admin/)
  services/
    mockData.js               seed data — delete once D1 is live
    api.js                     async client; swap function BODIES for real fetch() calls later
    dataLoader.js               the only data import surface pages/components use
  utilities/
    helpers.js                 DOM query/inject helpers, formatting, toast, modal mount
    booking.js                  booking form validation + custom-safari pricing
    channelLinks.js             wa.me / mailto: / tel: / m.me link builders
    auth.js                     mock login/session flag (in-memory)
    icons.js                    shared inline-SVG icon set
```

## New capabilities

- **Admin package & accommodation CRUD** — Admin → Packages / Accommodations now
  have working "New" / "Edit" / "Delete" actions that open a modal
  (`components/admin/packageForm.js`, `accForm.js`) and persist through
  `dataLoader.addPackage/editPackage/removePackage` (and the accommodation
  equivalents), which call `services/api.js`.
- **Multi-currency pricing** — every price is stored in USD. The header's
  currency switcher (visible to every visitor) calls `dataLoader.setCurrency()`,
  which is read by `dataLoader.money()` — the single formatting function every
  page/component uses instead of a hardcoded `$`. Rates live in
  `services/mockData.js:CURRENCIES` and are meant to be replaced by a live FX
  source (`api.js:getCurrencyRates`). Admins can also set the **default**
  currency for new visitors from Admin → Settings.

## Wiring up Cloudflare D1 (and auth/DNS) later

`services/api.js` is the seam. Every exported function currently reads/writes
the in-memory arrays from `mockData.js`; each one is documented with the
Worker route it should eventually call (e.g. `GET /api/packages`,
`POST /api/bookings`, `PUT /api/accommodations/:id`). To go live:

1. Stand up a Cloudflare Worker with a D1 binding and mirror the schema
   implied by `mockData.js` (parks, packages, accommodations, addons,
   reviews, bookings, settings).
2. Replace each function body in `api.js` with a `fetch()` call to the
   Worker — nothing in `dataLoader.js` or above needs to change, since it
   only ever imports from `api.js`.
3. Delete `mockData.js` once nothing imports it anymore.
4. Auth (`utilities/auth.js`) currently mocks `login`/`register` through
   `api.js`; swap those for real calls against a D1 `users` table plus a
   session cookie or JWT, and point custom domains/DNS at the Worker in the
   Cloudflare dashboard.
