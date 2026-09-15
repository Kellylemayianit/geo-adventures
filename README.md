# Geo Adventures Kenya — Site

A vanilla-JS single-page site for Geo Adventures Kenya (Kimana), rebuilt from the original
"Adven Trip" template with the same visual design but a modular, ES6, component-based
architecture (no framework, no build step — open `index.html` behind any static file server).

## Running it locally

Browsers block ES module `import` over `file://`, so serve the folder instead of double-clicking it:

```
cd geo-adventures
python3 -m http.server 8080
# then open http://localhost:8080
```

It also deploys as-is to GitHub Pages, Netlify, or any static host — no build step required.

## How it's organised

```
index.html          SPA shell — <link> tags + <script type="module" src="src/app.js">
styles/
  tokens.css              variables, reset, base type, layout primitives
  utilities/buttons.css   buttons, pills, filters, toggles, currency switcher
  components/             header, hero, card (+ modal), booking, footer, toast
  dashboard/              sidebar/bottom-nav, stat cards, admin shell/tables/forms
src/
  app.js                  route dispatch + auth guards (the kernel)
  router.js                hash parsing (#/route/id?query=..) + change subscription
  pages/                    one file per route, composes components + reads data
  components/                pure render functions (+ components/admin/)
  services/
    mockData.js             seed data — delete once a real backend (D1/Airtable) is live
    api.js                   async client; swap function BODIES for real fetch() calls later
    dataLoader.js            the only data import surface pages/components use
  utilities/
    helpers.js               DOM query/render helpers, formatting, toast, modal mount
    booking.js                booking form validation + custom-safari pricing
    channelLinks.js           wa.me / mailto: / tel: link builders — real contact details live here
    auth.js                   mock login/session (localStorage-backed, swap for real API later)
    icons.js                  shared inline-SVG icon set
```

## Data & accounts (demo state)

- Catalogue data (parks, stay tiers, transport, packages, team, stories) lives in
  `src/services/mockData.js` and is read-only in the UI for now.
- Users and bookings are mutable and persisted to `localStorage` so the demo survives a refresh.
- Demo admin login: `kellylemayian6@gmail.com` / `admin123`.
- Any new signup becomes a `client` role account automatically.

## Swapping in a real backend later

Only `src/services/api.js` needs to change — replace each function body with a real `fetch()`
call (e.g. to a Cloudflare Worker in front of D1/Airtable). `dataLoader.js`, every page and
every component are already written against that same function shape, so nothing else moves.

## Contact details

The single source of truth for phone/email/WhatsApp links is `src/utilities/channelLinks.js`.
Change it there once and it updates the header, footer, WhatsApp button, contact page and every
booking confirmation message site-wide.

## Images

`assets/img/*.svg` are generated placeholders (park name on a colour gradient) — swap them for
real photography before going live. Paths are referenced from `mockData.js` and page files.
