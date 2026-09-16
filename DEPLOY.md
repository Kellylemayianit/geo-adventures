# Deploying Geo Adventures Kenya today

Two pieces: the **Worker + D1 API** (`worker/`), and the **static frontend** (everything else).
Do the API first — the frontend needs its URL.

## 0. Prerequisites

- A free Cloudflare account
- Node.js installed locally
- `npm install -g wrangler` (or use `npx wrangler` for every command below)
- `wrangler login` (opens a browser to authorize)

## 1. Create the D1 database

```
cd worker
npm install
wrangler d1 create geo-adventures-db
```

This prints a `database_id`. Copy it into `worker/wrangler.toml`, replacing
`REPLACE_WITH_YOUR_D1_DATABASE_ID`.

## 2. Run the schema + seed data

```
npm run db:migrate     # creates all tables
npm run db:seed        # loads destinations, packages, team, stories, and the admin account
```

(Use `db:migrate:local` / `db:seed:local` instead if you want to test against a local D1
first with `wrangler dev` before touching the real remote database.)

## 3. Set the session-signing secret

```
wrangler secret put WORKER_SECRET
```

Paste any long random string when prompted (e.g. generate one with `openssl rand -hex 32`).
This signs login/session tokens — never commit it into `wrangler.toml`.

## 4. Deploy the Worker

```
npm run deploy
```

Wrangler prints a URL like `https://geo-adventures-api.<your-subdomain>.workers.dev` —
copy it.

## 5. Point the frontend at the Worker

Open `src/services/config.js` and set:

```js
export const API_BASE_URL = 'https://geo-adventures-api.<your-subdomain>.workers.dev';
```

## 6. Lock down CORS (recommended once you know your real domain)

In `worker/wrangler.toml`, change:

```
ALLOWED_ORIGIN = "*"
```

to your actual site origin, e.g. `"https://geoadventureskenya.com"`, then `npm run deploy`
again from `worker/`.

## 7. Deploy the frontend

The frontend (`index.html`, `styles/`, `src/`, `assets/`) is a static site — no build step.
Push it to GitHub Pages, Netlify, Cloudflare Pages, or any static host. If using GitHub Pages,
this is the same setup as the demo you showed earlier — just push the repo and enable Pages.

**Important:** don't open `index.html` via `file://` — ES modules are blocked there. Any static
host (or `python3 -m http.server` locally) works.

## 8. First login

- Admin: `kellylemayian6@gmail.com` / `admin123` — **change this password** by adding a
  "change password" flow, or update it directly in D1:
  ```
  wrangler d1 execute geo-adventures-db --remote --command \
    "DELETE FROM users WHERE email='kellylemayian6@gmail.com'"
  ```
  then sign up fresh through the site with the email you want as admin, and manually set its
  `role` to `admin` in D1:
  ```
  wrangler d1 execute geo-adventures-db --remote --command \
    "UPDATE users SET role='admin' WHERE email='you@example.com'"
  ```

## What to do later, not today

- Real photography instead of `assets/img/*.svg` placeholders
- Admin CRUD for packages/destinations (currently read-only preview screens — see
  `src/pages/dashboard/adminPackages.js` / `adminDestinations.js`; wiring these to
  `POST/PATCH/DELETE` endpoints on the Worker is the next natural step)
- A "forgot password" flow
