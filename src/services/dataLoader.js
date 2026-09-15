/* ==========================================================
   DATA LOADER — the only data import surface pages/components
   use. Wraps services/api.js, keeps a synchronous in-memory
   cache so page render functions can stay simple (no await
   sprinkled through every template), and owns the selected
   display currency.
   ========================================================== */
import * as api from './api.js';
import { CURRENCIES } from './mockData.js';

const CURRENCY_STORAGE_KEY = 'geo-adventures.currency';

const cache = {
  parks: [], packages: [], accommodations: [], addons: [], reviews: [],
  bookings: [], contact: {}, pricingRules: {}, settings: {},
  currency: (typeof localStorage!=='undefined' && localStorage.getItem(CURRENCY_STORAGE_KEY)) || 'USD',
  ready: false,
};

export async function init(){
  const [parks, packages, accommodations, addons, reviews, bookings, contact, pricingRules, settings] = await Promise.all([
    api.getParks(), api.getPackages(), api.getAccommodations(), api.getAddons(),
    api.getReviews(), api.getBookings(), api.getContact(), api.getPricingRules(), api.getSettings(),
  ]);
  Object.assign(cache, { parks, packages, accommodations, addons, reviews, bookings, contact, pricingRules, settings, ready:true });
  if(settings.defaultCurrency && !localStorage.getItem(CURRENCY_STORAGE_KEY)) cache.currency = settings.defaultCurrency;
  return cache;
}

/* -------- plain getters -------- */
export const parks = () => cache.parks;
export const packages = () => cache.packages;
export const accommodations = () => cache.accommodations;
export const addons = () => cache.addons;
export const reviews = () => cache.reviews;
export const bookings = () => cache.bookings;
export const contact = () => cache.contact;
export const pricingRules = () => cache.pricingRules;
export const settings = () => cache.settings;
export const parksById = () => Object.fromEntries(cache.parks.map(p=>[p.id,p]));
export const packagesById = () => Object.fromEntries(cache.packages.map(p=>[p.id,p]));
export const accommodationsById = () => Object.fromEntries(cache.accommodations.map(a=>[a.id,a]));

/* -------- currency -------- */
export function getCurrency(){ return cache.currency; }
export function listCurrencies(){ return CURRENCIES; }
export function setCurrency(code){
  if(!CURRENCIES[code]) return;
  cache.currency = code;
  try{ localStorage.setItem(CURRENCY_STORAGE_KEY, code); }catch(e){/* storage unavailable */}
}
// every stored price is USD; format it in whichever currency the customer picked
export function money(amountUsd){
  const cur = CURRENCIES[cache.currency] || CURRENCIES.USD;
  const converted = amountUsd * cur.rate;
  const rounded = cur.code==='KES' ? Math.round(converted) : Math.round(converted*100)/100;
  return `${cur.symbol}${rounded.toLocaleString('en-US')}`;
}

/* -------- package mutations (admin) -------- */
export async function addPackage(pkg){
  const record = await api.createPackage(pkg);
  cache.packages = [...cache.packages, record];
  return record;
}
export async function editPackage(id, patch){
  const record = await api.updatePackage(id, patch);
  cache.packages = cache.packages.map(p=>p.id===id ? record : p);
  return record;
}
export async function removePackage(id){
  await api.deletePackage(id);
  cache.packages = cache.packages.filter(p=>p.id!==id);
}

/* -------- accommodation mutations (admin) -------- */
export async function addAccommodation(acc){
  const record = await api.createAccommodation(acc);
  cache.accommodations = [...cache.accommodations, record];
  return record;
}
export async function editAccommodation(id, patch){
  const record = await api.updateAccommodation(id, patch);
  cache.accommodations = cache.accommodations.map(a=>a.id===id ? record : a);
  return record;
}
export async function removeAccommodation(id){
  await api.deleteAccommodation(id);
  cache.accommodations = cache.accommodations.filter(a=>a.id!==id);
}

/* -------- bookings -------- */
export async function addBooking(booking){
  const record = await api.createBooking(booking);
  cache.bookings = [...cache.bookings, record];
  return record;
}
export async function setBookingStatus(id, status){
  const record = await api.updateBookingStatus(id, status);
  cache.bookings = cache.bookings.map(b=>b.id===id ? record : b);
  return record;
}

/* -------- settings -------- */
export async function saveSettings(next){
  const record = await api.saveSettings(next);
  cache.settings = record;
  return record;
}
