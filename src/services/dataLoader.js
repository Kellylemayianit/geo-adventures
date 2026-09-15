// Pages and components import ONLY from here, never from api.js or mockData.js directly.
// Catalogue data (destinations/stays/transport/packages/team/stories) is cached in memory
// for the session since it doesn't change; bookings are always read fresh.
import * as api from './api.js';

const cache = {};

async function cached(key, loader){
  if (!cache[key]) cache[key] = await loader();
  return cache[key];
}

export const getDestinations = () => cached('destinations', api.fetchDestinations);
export const getDestination = (slug) => api.fetchDestination(slug);
export const getStayTiers = () => cached('stayTiers', api.fetchStayTiers);
export const getTransportOptions = () => cached('transport', api.fetchTransportOptions);
export const getPackages = () => cached('packages', api.fetchPackages);
export const getPackage = (slug) => api.fetchPackage(slug);
export const getTeam = () => cached('team', api.fetchTeam);
export const getStories = () => cached('stories', api.fetchStories);
export const getStory = (slug) => api.fetchStory(slug);
export const getTestimonials = () => cached('testimonials', api.fetchTestimonials);

export const getBookings = (filterFn) => api.fetchBookings(filterFn);
export const createBooking = (booking) => api.createBooking(booking);
export const setBookingStatus = (id, status) => api.setBookingStatus(id, status);
