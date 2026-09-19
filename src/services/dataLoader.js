// Pages and components import ONLY from here, never from api.js or mockData.js directly.
// Catalogue data (destinations/stays/transport/packages/team/stories) is cached in memory
// for the session since it doesn't change; bookings are always read fresh.
import * as api from './api.js';

const cache = {};

async function cached(key, loader){
  if (!cache[key]){
    cache[key] = Promise.resolve().then(loader).catch((e) => {
      delete cache[key];
      throw e;
    });
  }
  return cache[key];
}

export const getDestinations = () => cached('destinations', api.fetchDestinations);
export const getDestination = (slug) => cached(`destination:${slug}`, () => api.fetchDestination(slug));
export const getStayTiers = () => cached('stayTiers', api.fetchStayTiers);
export const getTransportOptions = () => cached('transport', api.fetchTransportOptions);
export const getPackages = () => cached('packages', api.fetchPackages);
export const getPackage = (slug) => cached(`package:${slug}`, () => api.fetchPackage(slug));
export const getTeam = () => cached('team', api.fetchTeam);
export const getStories = () => cached('stories', api.fetchStories);
export const getStory = (slug) => cached(`story:${slug}`, () => api.fetchStory(slug));
export const getTestimonials = () => cached('testimonials', api.fetchTestimonials);

// Filtering by "mine vs all" now happens server-side based on the auth token, so this
// takes no filter function — the Worker returns only what the logged-in user is allowed to see.
export const getBookings = () => api.fetchBookings();
export const createBooking = (booking) => api.createBooking(booking);
export const setBookingStatus = (id, status) => api.setBookingStatus(id, status);
