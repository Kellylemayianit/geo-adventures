// Seed data. Everything mutable (users, bookings) is mirrored into localStorage so the
// demo persists across a refresh. Read-only catalogue data (destinations, stays, transport,
// packages, team, stories) just lives in memory here — point dataLoader.js at a real API
// later and none of the pages need to change.

export const DESTINATIONS = [
  {
    id: 'amboseli', slug: 'amboseli', name: 'Amboseli National Park', region: 'South Rift, near Kimana',
    tagline: 'Big elephants, bigger mountain',
    description: 'Amboseli sits in our backyard here in Kimana — you can watch its elephant herds cross the plains with Kilimanjaro standing over them like a painting. This is usually the first park we send first-time visitors to, and the one our regulars keep coming back for.',
    image: 'assets/img/dest-amboseli.svg',
    activities: ['Game drives', 'Kilimanjaro viewpoints', 'Maasai village visit', 'Birdwatching'],
    bestFor: 'Elephants, Kilimanjaro views, short trips from Kimana',
    priceFromKes: 3500,
  },
  {
    id: 'maasai-mara', slug: 'maasai-mara', name: 'Maasai Mara National Reserve', region: 'Narok County',
    tagline: 'Home of the great wildebeest crossing',
    description: 'The Mara needs no introduction — endless grass, the big cats that own it, and if your dates line up, the wildebeest crossing the Mara River. It is a longer drive from Kimana, so most of our Mara packages are built for 4 days and up.',
    image: 'assets/img/dest-mara.svg',
    activities: ['Big cat game drives', 'Wildebeest migration (seasonal)', 'Hot air balloon add-on', 'Maasai cultural visit'],
    bestFor: 'Big cats, the migration, classic Kenya safari',
    priceFromKes: 4200,
  },
  {
    id: 'tsavo-east', slug: 'tsavo-east', name: 'Tsavo East National Park', region: 'Taita-Taveta County',
    tagline: 'Red elephants and open plains',
    description: 'Tsavo East is raw and wide open — its elephants turn red from dusting themselves in the local soil. It pairs well with Amboseli on a longer circuit, and the drive down from Kimana passes some of the best roadside views in the south.',
    image: 'assets/img/dest-tsavo-east.svg',
    activities: ['Game drives', 'Lugard Falls', 'Aruba Dam wildlife viewing'],
    bestFor: 'Red elephants, open savannah, combining with Amboseli',
    priceFromKes: 3200,
  },
  {
    id: 'tsavo-west', slug: 'tsavo-west', name: 'Tsavo West National Park', region: 'Taita-Taveta County',
    tagline: 'Volcanic hills and crystal springs',
    description: 'Tsavo West trades open plains for volcanic hills, lava flows and the clear waters of Mzima Springs, where you can watch hippos underwater from a viewing chamber. A favourite add-on for people who want more scenery variety in one trip.',
    image: 'assets/img/dest-tsavo-west.svg',
    activities: ['Mzima Springs', 'Shetani Lava Flows', 'Game drives', 'Rhino sanctuary'],
    bestFor: 'Scenery, springs, a change of pace from open plains',
    priceFromKes: 3200,
  },
  {
    id: 'lake-nakuru', slug: 'lake-nakuru', name: 'Lake Nakuru National Park', region: 'Great Rift Valley',
    tagline: 'Flamingos on the Rift Valley floor',
    description: 'Deep in the Rift Valley, Lake Nakuru is where we send guests chasing flamingo photographs and rhino sightings in one stop. It fits naturally into a Rift Valley circuit alongside other lakes in the region.',
    image: 'assets/img/dest-nakuru.svg',
    activities: ['Flamingo viewing', 'Rhino tracking', 'Baboon Cliff viewpoint'],
    bestFor: 'Flamingos, rhinos, Rift Valley scenery',
    priceFromKes: 3000,
  },
  {
    id: 'nairobi-np', slug: 'nairobi-national-park', name: 'Nairobi National Park', region: 'Nairobi',
    tagline: 'A safari with the city skyline behind it',
    description: 'A convenient stop for guests flying in or out of Nairobi — real wildlife, city skyline in the background. We often use it as the first or last stop on a longer circuit rather than a standalone trip.',
    image: 'assets/img/dest-nairobi-np.svg',
    activities: ['Game drives', 'Animal orphanage visit', 'Short walking trail'],
    bestFor: 'Airport layovers, quick half-day safaris',
    priceFromKes: 2200,
  },
];

export const STAY_TIERS = [
  {
    id: 'budget', label: 'Budget Camp', pricePerNightKes: 3200,
    description: 'Simple tented camps and guesthouses close to the parks — clean, comfortable, no frills.',
  },
  {
    id: 'midrange', label: 'Comfort Lodge', pricePerNightKes: 8500,
    description: 'Established lodges and tented camps with en-suite rooms, pools and proper dining.',
  },
  {
    id: 'luxury', label: 'Luxury Camp', pricePerNightKes: 22000,
    description: 'High-end tented camps and lodges — private verandas, top-tier service, prime locations inside or on the edge of the park.',
  },
];

export const TRANSPORT_OPTIONS = [
  {
    id: 'saloon', label: 'Saloon Car', pricePerDayKes: 4000, capacity: 4, icon: 'car',
    description: 'Comfortable and economical for tarmac routes and shorter transfers around Kimana and nearby towns.',
  },
  {
    id: '4x4', label: '4x4 Safari Land Cruiser', pricePerDayKes: 9500, capacity: 6, icon: 'car',
    description: 'Pop-up roof, built for game drives and rough park tracks — our most-booked option for actual safari days.',
  },
  {
    id: 'motorbike', label: 'Motorbike (Boda)', pricePerDayKes: 1500, capacity: 1, icon: 'bike',
    description: 'Quick, affordable transport for solo travellers moving around Kimana town and short local hops.',
  },
  {
    id: 'tuktuk', label: 'Tuktuk', pricePerDayKes: 2200, capacity: 3, icon: 'bike',
    description: 'A practical, local way to move around town and to nearby lodges — light on the pocket.',
  },
];

export const PACKAGES = [
  {
    id: 'p1', slug: 'amboseli-weekend', title: 'Amboseli Weekend Escape', classLabel: 'Budget', days: 3,
    destinationIds: ['amboseli'], stayTier: 'budget', transportId: 'saloon',
    pricePerPersonKes: 21500, image: 'assets/img/pkg-amboseli-weekend.svg',
    summary: 'A quick, affordable dash to Amboseli from Kimana — elephants and Kilimanjaro over a long weekend.',
    highlights: ['2 nights budget camp', 'Two game drives', 'Return transport from Kimana', 'Maasai village stop'],
    itinerary: [
      { day: 1, title: 'Kimana to Amboseli', text: 'Pick-up in Kimana, afternoon game drive as you enter the park.' },
      { day: 2, title: 'Full day in the park', text: 'Morning and evening game drives, midday rest at camp.' },
      { day: 3, title: 'Sunrise drive and return', text: 'Early game drive, breakfast, drive back to Kimana.' },
    ],
  },
  {
    id: 'p2', slug: 'amboseli-tsavo-circuit', title: 'Amboseli & Tsavo Circuit', classLabel: 'Comfort', days: 5,
    destinationIds: ['amboseli', 'tsavo-east', 'tsavo-west'], stayTier: 'midrange', transportId: '4x4',
    pricePerPersonKes: 68000, image: 'assets/img/pkg-amboseli-tsavo.svg',
    summary: 'Elephants at Amboseli, red elephants and springs at Tsavo — the classic southern circuit done properly.',
    highlights: ['4 nights comfort lodges', 'Private 4x4 throughout', 'Mzima Springs visit', 'Park fees included'],
    itinerary: [
      { day: 1, title: 'Kimana to Amboseli', text: 'Afternoon game drive on arrival.' },
      { day: 2, title: 'Amboseli full day', text: 'Elephants and Kilimanjaro views, morning and evening drives.' },
      { day: 3, title: 'Transfer to Tsavo West', text: 'Mzima Springs hippo-viewing chamber in the afternoon.' },
      { day: 4, title: 'Tsavo East', text: 'Cross into Tsavo East, game drive toward Aruba Dam.' },
      { day: 5, title: 'Return to Kimana', text: 'Morning drive, then transfer home.' },
    ],
  },
  {
    id: 'p3', slug: 'mara-migration-luxury', title: 'Maasai Mara Migration Luxury', classLabel: 'Luxury', days: 4,
    destinationIds: ['maasai-mara'], stayTier: 'luxury', transportId: '4x4',
    pricePerPersonKes: 145000, image: 'assets/img/pkg-mara-luxury.svg',
    summary: 'Front-row seats to the Mara, in a luxury tented camp on the reserve\u2019s edge.',
    highlights: ['3 nights luxury tented camp', 'Private 4x4 with pop-up roof', 'Optional balloon safari add-on', 'Cultural Maasai village visit'],
    itinerary: [
      { day: 1, title: 'Kimana to Maasai Mara', text: 'Scenic transfer through the Rift Valley, evening game drive.' },
      { day: 2, title: 'Full day in the Mara', text: 'Big cat tracking, optional balloon safari at dawn.' },
      { day: 3, title: 'Mara River & culture', text: 'Migration crossing points (seasonal), Maasai village visit.' },
      { day: 4, title: 'Morning drive and return', text: 'Last game drive, transfer back to Kimana.' },
    ],
  },
  {
    id: 'p4', slug: 'rift-valley-explorer', title: 'Rift Valley Explorer', classLabel: 'Comfort', days: 6,
    destinationIds: ['lake-nakuru', 'maasai-mara'], stayTier: 'midrange', transportId: '4x4',
    pricePerPersonKes: 92000, image: 'assets/img/pkg-rift-valley.svg',
    summary: 'Flamingos and rhinos at Lake Nakuru, then on to the Mara — the full Rift Valley story in one trip.',
    highlights: ['5 nights comfort lodges', 'Private 4x4 throughout', 'Rhino tracking at Nakuru', 'Big cat drives in the Mara'],
    itinerary: [
      { day: 1, title: 'Kimana to Nakuru', text: 'Long transfer, arrive in time for an evening game drive.' },
      { day: 2, title: 'Lake Nakuru full day', text: 'Flamingos, rhino tracking, Baboon Cliff viewpoint.' },
      { day: 3, title: 'Transfer to Maasai Mara', text: 'Scenic drive across the valley floor.' },
      { day: 4, title: 'Mara full day', text: 'Morning and evening game drives.' },
      { day: 5, title: 'Mara River area', text: 'Migration crossing points (seasonal) and culture visit.' },
      { day: 6, title: 'Return to Kimana', text: 'Morning drive, transfer home.' },
    ],
  },
  {
    id: 'p5', slug: 'kimana-day-safari', title: 'Kimana Day Safari', classLabel: 'Budget', days: 1,
    destinationIds: ['amboseli'], stayTier: 'budget', transportId: 'saloon',
    pricePerPersonKes: 8500, image: 'assets/img/pkg-day-safari.svg',
    summary: 'No time for a full trip? A single day in Amboseli, out and back from Kimana before dark.',
    highlights: ['Full day game drive', 'Packed lunch', 'Return transport from Kimana', 'No overnight needed'],
    itinerary: [
      { day: 1, title: 'Kimana to Amboseli and back', text: 'Early pick-up, full day game drive, drop-off in Kimana by evening.' },
    ],
  },
  {
    id: 'p6', slug: 'grand-southern-luxury', title: 'Grand Southern Circuit', classLabel: 'Luxury', days: 7,
    destinationIds: ['amboseli', 'tsavo-west', 'tsavo-east'], stayTier: 'luxury', transportId: '4x4',
    pricePerPersonKes: 210000, image: 'assets/img/pkg-grand-southern.svg',
    summary: 'The full southern circuit at a slower, more indulgent pace — Amboseli and both Tsavo parks in luxury camps.',
    highlights: ['6 nights luxury camps', 'Private 4x4 with driver-guide throughout', 'All park fees included', 'Mzima Springs & Shetani Lava Flows'],
    itinerary: [
      { day: 1, title: 'Kimana to Amboseli', text: 'Settle into camp, evening game drive.' },
      { day: 2, title: 'Amboseli full day', text: 'Elephants and Kilimanjaro, two game drives.' },
      { day: 3, title: 'Transfer to Tsavo West', text: 'Mzima Springs, afternoon at leisure.' },
      { day: 4, title: 'Tsavo West full day', text: 'Shetani Lava Flows, rhino sanctuary visit.' },
      { day: 5, title: 'Transfer to Tsavo East', text: 'Game drive en route, evening at Aruba Dam.' },
      { day: 6, title: 'Tsavo East full day', text: 'Morning and evening game drives.' },
      { day: 7, title: 'Return to Kimana', text: 'Relaxed morning, transfer home.' },
    ],
  },
];

export const TEAM = [
  { id: 't1', name: 'Kelly Lemayian', role: 'Founder & Lead Guide', bio: 'Grew up around Kimana and Amboseli, and has been guiding visitors through the south for years.', image: 'assets/img/team-kelly.svg' },
  { id: 't2', name: 'Naserian Sankale', role: 'Bookings & Guest Care', bio: 'Handles every enquiry personally — the first voice most guests hear on WhatsApp.', image: 'assets/img/team-naserian.svg' },
  { id: 't3', name: 'Joseph Mwangangi', role: 'Driver-Guide, 4x4 Fleet', bio: 'Knows the Tsavo and Amboseli tracks like the back of his hand.', image: 'assets/img/team-joseph.svg' },
  { id: 't4', name: 'Grace Wanjiru', role: 'Transport Coordinator', bio: 'Matches every booking to the right vehicle, from saloon cars to the safari Land Cruisers.', image: 'assets/img/team-grace.svg' },
];

export const STORIES = [
  {
    id: 's1', slug: 'why-we-start-in-kimana', title: 'Why Every Journey Starts in Kimana', date: '2026-07-12',
    excerpt: 'Kimana is not just our address — it is the reason our Amboseli trips are shorter, cheaper, and better timed than most.',
    image: 'assets/img/blog-kimana.svg',
    body: 'Most safari companies operate out of Nairobi and treat the south as a long drive away. We are based right here in Kimana, minutes from the Amboseli gate, which means our guests spend less time on the road and more time watching elephants. It also means we know which camps are quiet in high season, which routes flood after the rains, and which guides actually grew up on this land.',
  },
  {
    id: 's2', slug: 'reading-amboseli-elephants', title: 'How to Read an Amboseli Elephant Herd', date: '2026-06-02',
    excerpt: 'A short guide to what our guides are actually looking at during a morning game drive.',
    image: 'assets/img/blog-elephants.svg',
    body: 'Watch the matriarch first — she decides when the herd moves and where. Calves stay tucked between adults, never at the edge. A herd spread wide and relaxed means no danger nearby; a tight, alert cluster means they have sensed something. This is the kind of detail our driver-guides point out on every Amboseli drive.',
  },
  {
    id: 's3', slug: 'build-your-own-safari-explained', title: 'Build-Your-Own Safari, Explained', date: '2026-05-18',
    excerpt: 'Most of our fixed packages exist because guests kept asking for the same combinations — but you can also build your own from scratch.',
    image: 'assets/img/blog-builder.svg',
    body: 'Pick a park or two, choose your stay tier, choose your transport, tell us your travel dates and number of people. We price it live and confirm over WhatsApp. It works exactly like our fixed packages behind the scenes — we are just letting you choose the pieces yourself.',
  },
];

export const TESTIMONIALS = [
  { id: 'r1', name: 'Amina H.', text: 'Booked the Amboseli weekend on short notice and the team sorted everything over WhatsApp within the day.', rating: 5 },
  { id: 'r2', name: 'David O.', text: 'Our driver-guide Joseph knew exactly where the herds would be each morning. Best safari we have done.', rating: 5 },
  { id: 'r3', name: 'Lena F.', text: 'Loved that we could pick our own stay and transport instead of a rigid package. Fair pricing too.', rating: 4 },
];

/* ---------------- Mutable data (users + bookings), mirrored to localStorage ---------------- */

const USERS_KEY = 'gak_users';
const BOOKINGS_KEY = 'gak_bookings';

const SEED_USERS = [
  { id: 'admin1', name: 'Kelly Lemayian', email: 'kellylemayian6@gmail.com', password: 'admin123', phone: '0113556385', role: 'admin', createdAt: '2026-01-01T00:00:00.000Z' },
];

function readJSON(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function writeJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(){
  const stored = readJSON(USERS_KEY, null);
  if (stored) return stored;
  writeJSON(USERS_KEY, SEED_USERS);
  return SEED_USERS.slice();
}
export function saveUsers(users){
  writeJSON(USERS_KEY, users);
}

export function getBookings(){
  return readJSON(BOOKINGS_KEY, []);
}
export function saveBookings(bookings){
  writeJSON(BOOKINGS_KEY, bookings);
}
export function addBooking(booking){
  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);
  return booking;
}
export function updateBookingStatus(id, status){
  const bookings = getBookings();
  const found = bookings.find((b) => b.id === id);
  if (found) found.status = status;
  saveBookings(bookings);
  return found;
}
