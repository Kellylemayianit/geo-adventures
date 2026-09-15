/* ==========================================================
   MOCK DATA — seed data for local development.
   Delete this file once Cloudflare D1 is live; api.js should
   then read from D1-backed endpoints instead of these arrays.
   ========================================================== */

export const PARKS = [
  { id:'amboseli', name:'Amboseli National Park', coord:'2.6529° S, 37.2606° E', img:'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=900&q=60', bestTime:'Jun – Oct', entranceFee:60, highlights:['Kilimanjaro views','Elephant herds','Swamps'], wildlife:['Elephant','Lion','Cheetah','Hyena'], description:'Amboseli sits in the shadow of Kilimanjaro and is known for its large, free-ranging elephant herds against a backdrop of Africa\'s tallest peak.' },
  { id:'mara', name:'Maasai Mara National Reserve', coord:'1.4061° S, 35.0117° E', img:'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=60', bestTime:'Jul – Sep', entranceFee:80, highlights:['Great Migration','Big Five','Balloon safaris'], wildlife:['Wildebeest','Lion','Leopard','Rhino'], description:'The Mara is the northern half of the Serengeti ecosystem, famous for the Great Migration and some of the densest predator populations in Africa.' },
  { id:'tsavo-e', name:'Tsavo East National Park', coord:'3.3833° S, 38.5667° E', img:'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=60', bestTime:'Jan – Feb', entranceFee:52, highlights:['Red elephants','Yatta plateau','Galana river'], wildlife:['Elephant','Lion','Crocodile','Oryx'], description:'Tsavo East is vast open savanna, home to elephants dyed red by the local dust and the world\'s longest lava flow, the Yatta Plateau.' },
  { id:'tsavo-w', name:'Tsavo West National Park', coord:'3.4167° S, 38.1000° E', img:'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=900&q=60', bestTime:'Jun – Oct', entranceFee:52, highlights:['Mzima Springs','Volcanic hills','Rhino sanctuary'], wildlife:['Rhino','Hippo','Leopard','Buffalo'], description:'More rugged and varied than its eastern half, Tsavo West offers crystal-clear springs, lava fields, and a dedicated black rhino sanctuary.' },
];

export const PACKAGES = [
  { id:'pkg-migration', name:'Great Migration Explorer', parks:['mara'], img:PARKS[1].img, duration:5, price:2450, rating:4.9, accommodationTier:'luxury', transport:'jeep', itinerary:['Arrive Nairobi, transfer to the Mara','Full-day game drive, river crossings','Balloon safari + bush breakfast','Cultural visit to a Maasai village','Final drive & departure'], included:['All park fees','4×4 game drives','Luxury tented camp'], notIncluded:['International flights','Travel insurance','Alcoholic drinks'] },
  { id:'pkg-kili-elephants', name:'Kilimanjaro & Elephants', parks:['amboseli'], img:PARKS[0].img, duration:3, price:1180, rating:4.7, accommodationTier:'mid', transport:'jeep', itinerary:['Arrive Amboseli, sunset game drive','Full-day photography safari','Morning drive, depart'], included:['Park fees','Game drives','Mid-range lodge'], notIncluded:['Flights','Gratuities'] },
  { id:'pkg-red-earth', name:'Red Earth Tsavo Circuit', parks:['tsavo-e','tsavo-w'], img:PARKS[2].img, duration:6, price:1980, rating:4.6, accommodationTier:'mid', transport:'jeep', itinerary:['Arrive Tsavo East','Yatta Plateau & red elephants','Transfer to Tsavo West','Mzima Springs boardwalk','Rhino sanctuary tracking','Depart'], included:['Park fees','Transfers between parks','Game drives'], notIncluded:['Flights','Optional balloon safari'] },
  { id:'pkg-budget-mara', name:'Budget Mara Weekender', parks:['mara'], img:PARKS[1].img, duration:2, price:640, rating:4.3, accommodationTier:'budget', transport:'motorbike', itinerary:['Arrive, afternoon drive','Morning drive, depart'], included:['Park fees','Shared game drives'], notIncluded:['Meals outside camp','Flights'] },
];

export const ACCOMMODATIONS = [
  { id:'acc-1', name:'Kilima Tented Camp', parkId:'amboseli', tier:'mid', price:180, img:PARKS[0].img },
  { id:'acc-2', name:'Migration River Lodge', parkId:'mara', tier:'luxury', price:420, img:PARKS[1].img },
  { id:'acc-3', name:'Yatta Ridge Camp', parkId:'tsavo-e', tier:'budget', price:75, img:PARKS[2].img },
  { id:'acc-4', name:'Mzima Springs Lodge', parkId:'tsavo-w', tier:'mid', price:190, img:PARKS[3].img },
  { id:'acc-5', name:'Savanna Star Camp', parkId:'mara', tier:'budget', price:90, img:PARKS[1].img },
  { id:'acc-6', name:'Elephant Watch House', parkId:'amboseli', tier:'luxury', price:510, img:PARKS[0].img },
  { id:'acc-7', name:'Rhino Ridge Retreat', parkId:'tsavo-w', tier:'luxury', price:465, img:PARKS[3].img },
  { id:'acc-8', name:'Galana River Camp', parkId:'tsavo-e', tier:'mid', price:165, img:PARKS[2].img },
];

export const ADDONS = [
  { id:'add-1', name:'Hot air balloon safari', price:180 },
  { id:'add-2', name:'Maasai village visit', price:40 },
  { id:'add-3', name:'Private guide upgrade', price:120 },
  { id:'add-4', name:'Airstrip transfer', price:90 },
];

export const REVIEWS = [
  { parkId:'mara', guestName:'Sarah Mwangi', rating:5, comment:'The migration crossing was the single best thing I have ever watched.' },
  { parkId:'amboseli', guestName:'Tom Delacroix', rating:5, comment:'Elephants with Kilimanjaro behind them — worth every hour of the drive.' },
];

export const BOOKINGS = [
  { id:'BK-1042', guestEmail:'sarah@example.com', packageId:'pkg-migration', groupSize:2, startDate:'2026-09-14', status:'confirmed', totalPrice:4900, createdAt:'2026-07-01' },
  { id:'BK-1043', guestEmail:'sarah@example.com', packageId:'pkg-kili-elephants', groupSize:1, startDate:'2026-05-02', status:'confirmed', totalPrice:1180, createdAt:'2026-03-11' },
  { id:'BK-1044', guestEmail:'lena@example.com', packageId:'pkg-red-earth', groupSize:4, startDate:'2026-10-20', status:'pending', totalPrice:7920, createdAt:'2026-08-02' },
  { id:'BK-1045', guestEmail:'jomo@example.com', packageId:'pkg-budget-mara', groupSize:2, startDate:'2026-04-11', status:'cancelled', totalPrice:1280, createdAt:'2026-02-19' },
];

export const TODAY = '2026-08-17';

export const CONTACT = { whatsappNumber:'254700000000', email:'info@geoadventures.travel', phone:'+254 700 000 000', companyName:'Geo Adventures' };

export const PRICING_RULES = { basePricePerParkPerDay:90, accommodationMultiplier:{budget:1,mid:1.6,luxury:2.6}, transportMultiplier:{jeep:1,motorbike:.85} };

/* Base currency for every stored price is USD. Rates are USD -> unit.
   In production, swap this for a live FX endpoint (see api.js:getCurrencyRates). */
export const CURRENCIES = {
  USD:{ code:'USD', symbol:'$',   label:'US Dollar',     rate:1 },
  KES:{ code:'KES', symbol:'KSh', label:'Kenyan Shilling', rate:129 },
  EUR:{ code:'EUR', symbol:'€',   label:'Euro',          rate:0.92 },
  GBP:{ code:'GBP', symbol:'£',   label:'British Pound', rate:0.79 },
};

export const DEFAULT_SETTINGS = {
  companyName:'Geo Adventures',
  contactEmail:'info@geoadventures.travel',
  whatsappNumber:'254700000000',
  defaultCurrency:'USD',
};
