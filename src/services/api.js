import {
  DESTINATIONS, STAY_TIERS, TRANSPORT_OPTIONS, PACKAGES, TEAM, STORIES, TESTIMONIALS,
  getBookings, addBooking, updateBookingStatus,
} from './mockData.js';

// Every function here is async on purpose, even though the mock version resolves instantly —
// this is the seam where real fetch() calls to the eventual API/D1 backend get dropped in.
// Pages/components should never import mockData.js directly; go through dataLoader.js instead.

export async function fetchDestinations(){
  return DESTINATIONS;
}
export async function fetchDestination(slug){
  return DESTINATIONS.find((d) => d.slug === slug) || null;
}
export async function fetchStayTiers(){
  return STAY_TIERS;
}
export async function fetchTransportOptions(){
  return TRANSPORT_OPTIONS;
}
export async function fetchPackages(){
  return PACKAGES;
}
export async function fetchPackage(slug){
  return PACKAGES.find((p) => p.slug === slug) || null;
}
export async function fetchTeam(){
  return TEAM;
}
export async function fetchStories(){
  return STORIES;
}
export async function fetchStory(slug){
  return STORIES.find((s) => s.slug === slug) || null;
}
export async function fetchTestimonials(){
  return TESTIMONIALS;
}
export async function fetchBookings(filterFn){
  const all = getBookings();
  return filterFn ? all.filter(filterFn) : all;
}
export async function createBooking(booking){
  return addBooking(booking);
}
export async function setBookingStatus(id, status){
  return updateBookingStatus(id, status);
}
