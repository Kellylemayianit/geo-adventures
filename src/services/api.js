import { API_BASE_URL } from './config.js';
import { getToken } from '../utilities/session.js';

// The one seam that talks to the network. Every function here matches the shape it had when
// it read from mockData.js, so dataLoader.js and every page/component needed zero changes.

export async function apiFetch(path, options = {}){
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
}

export const fetchDestinations = () => apiFetch('/api/destinations');
export const fetchDestination = (slug) => apiFetch(`/api/destinations/${encodeURIComponent(slug)}`);
export const fetchStayTiers = () => apiFetch('/api/stay-tiers');
export const fetchTransportOptions = () => apiFetch('/api/transport');
export const fetchPackages = () => apiFetch('/api/packages');
export const fetchPackage = (slug) => apiFetch(`/api/packages/${encodeURIComponent(slug)}`);
export const fetchTeam = () => apiFetch('/api/team');
export const fetchStories = () => apiFetch('/api/stories');
export const fetchStory = (slug) => apiFetch(`/api/stories/${encodeURIComponent(slug)}`);
export const fetchTestimonials = () => apiFetch('/api/testimonials');

export const fetchBookings = () => apiFetch('/api/bookings');
export const createBooking = (booking) => apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(booking) });
export const setBookingStatus = (id, status) =>
  apiFetch(`/api/bookings/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const loginRequest = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const signupRequest = (name, email, password, phone) =>
  apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) });
