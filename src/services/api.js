/* ==========================================================
   API CLIENT
   Every export here is async and returns the same shape a
   real network call would. Right now each function body reads
   from the in-memory mock arrays; when Cloudflare D1 is wired
   up behind a Worker, swap ONLY the function bodies below for
   real `fetch('/api/...')` calls — nothing outside this file
   (dataLoader.js is the only importer) needs to change.

   Suggested future endpoints (Worker + D1):
     GET    /api/parks
     GET    /api/packages            POST /api/packages
     PUT    /api/packages/:id        DELETE /api/packages/:id
     GET    /api/accommodations      POST /api/accommodations
     PUT    /api/accommodations/:id  DELETE /api/accommodations/:id
     GET    /api/bookings            POST /api/bookings
     PUT    /api/bookings/:id/status
     POST   /api/auth/login          POST /api/auth/register
     GET    /api/settings            PUT  /api/settings
     GET    /api/fx-rates
   Auth/session/DNS notes live in utilities/auth.js.
   ========================================================== */
import {
  PARKS, PACKAGES, ACCOMMODATIONS, ADDONS, REVIEWS, BOOKINGS,
  CONTACT, PRICING_RULES, CURRENCIES, DEFAULT_SETTINGS,
} from './mockData.js';

// simulated network latency, so loading states behave like the real thing
const wait = (ms=120) => new Promise(r=>setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));
const nextId = (prefix, list) => `${prefix}-${Date.now().toString(36)}`;

let _settings = clone(DEFAULT_SETTINGS);

export async function getParks(){ await wait(); return clone(PARKS); }
export async function getAddons(){ await wait(); return clone(ADDONS); }
export async function getReviews(){ await wait(); return clone(REVIEWS); }
export async function getContact(){ await wait(); return clone(CONTACT); }
export async function getPricingRules(){ await wait(); return clone(PRICING_RULES); }
export async function getCurrencies(){ await wait(); return clone(CURRENCIES); }
export async function getSettings(){ await wait(); return clone(_settings); }
export async function saveSettings(next){ await wait(); _settings = {..._settings, ...next}; return clone(_settings); }

/* -------- packages: admin create/edit/remove -------- */
export async function getPackages(){ await wait(); return clone(PACKAGES); }
export async function createPackage(pkg){
  await wait();
  const record = { ...pkg, id: pkg.id || nextId('pkg', PACKAGES) };
  PACKAGES.push(record);
  return clone(record);
}
export async function updatePackage(id, patch){
  await wait();
  const idx = PACKAGES.findIndex(p=>p.id===id);
  if(idx===-1) throw new Error('Package not found');
  PACKAGES[idx] = { ...PACKAGES[idx], ...patch, id };
  return clone(PACKAGES[idx]);
}
export async function deletePackage(id){
  await wait();
  const idx = PACKAGES.findIndex(p=>p.id===id);
  if(idx!==-1) PACKAGES.splice(idx,1);
  return { ok:true };
}

/* -------- accommodations: admin create/edit/remove -------- */
export async function getAccommodations(){ await wait(); return clone(ACCOMMODATIONS); }
export async function createAccommodation(acc){
  await wait();
  const record = { ...acc, id: acc.id || nextId('acc', ACCOMMODATIONS) };
  ACCOMMODATIONS.push(record);
  return clone(record);
}
export async function updateAccommodation(id, patch){
  await wait();
  const idx = ACCOMMODATIONS.findIndex(a=>a.id===id);
  if(idx===-1) throw new Error('Accommodation not found');
  ACCOMMODATIONS[idx] = { ...ACCOMMODATIONS[idx], ...patch, id };
  return clone(ACCOMMODATIONS[idx]);
}
export async function deleteAccommodation(id){
  await wait();
  const idx = ACCOMMODATIONS.findIndex(a=>a.id===id);
  if(idx!==-1) ACCOMMODATIONS.splice(idx,1);
  return { ok:true };
}

/* -------- bookings -------- */
export async function getBookings(){ await wait(); return clone(BOOKINGS); }
export async function createBooking(booking){
  await wait();
  const record = { ...booking, id: booking.id || ('BK-'+(1040+BOOKINGS.length+1)) };
  BOOKINGS.push(record);
  return clone(record);
}
export async function updateBookingStatus(id, status){
  await wait();
  const b = BOOKINGS.find(b=>b.id===id);
  if(b) b.status = status;
  return b ? clone(b) : null;
}

/* -------- auth (mock) --------
   Swap for real calls to a Worker route backed by D1 `users`
   table + hashed passwords / a session cookie once ready. */
export async function login({ email, password }){
  await wait();
  const name = email.split('@')[0].replace(/\./g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  return { name, email, role:'guest' };
}
export async function register({ name, email, password }){
  await wait();
  return { name, email, role:'guest' };
}

/* -------- currency / FX --------
   Swap for a live FX endpoint (or a cached D1 table refreshed
   on a cron trigger) later; shape stays { CODE: rateFromUSD }. */
export async function getCurrencyRates(){
  await wait();
  return Object.fromEntries(Object.values(clone(CURRENCIES)).map(c=>[c.code, c.rate]));
}
