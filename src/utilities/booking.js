// Pure pricing + validation logic — no DOM, no imports from services, so it's easy to
// reason about and reuse between the package detail page and the build-your-own page.

/**
 * @param {Object} opts
 * @param {Array}  opts.destinations   selected destination objects (each has priceFromKes)
 * @param {Object} opts.stayTier       selected stay tier object (has pricePerNightKes)
 * @param {Object} opts.transport      selected transport object (has pricePerDayKes, capacity)
 * @param {number} opts.travelers
 * @param {number} opts.days
 */
export function computeCustomPrice({ destinations = [], stayTier, transport, travelers = 1, days = 1 }){
  const nights = Math.max(days - 1, 0);
  const parkFees = destinations.reduce((sum, d) => sum + d.priceFromKes, 0) * travelers;
  const stayCost = stayTier ? stayTier.pricePerNightKes * travelers * nights : 0;
  const vehiclesNeeded = transport ? Math.ceil(travelers / transport.capacity) : 0;
  const transportCost = transport ? transport.pricePerDayKes * vehiclesNeeded * days : 0;
  return {
    parkFees,
    stayCost,
    transportCost,
    total: parkFees + stayCost + transportCost,
    vehiclesNeeded,
    nights,
  };
}

export function computePackagePrice(pkg, travelers = 1){
  return pkg.pricePerPersonKes * travelers;
}

export function validateBookingFields(fields){
  const errors = {};
  if (!fields.name || fields.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!fields.phone || !/^0\d{9}$/.test(fields.phone.replace(/\s+/g, ''))) {
    errors.phone = 'Enter a valid Kenyan phone number, e.g. 0113556385.';
  }
  if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (!fields.travelers || Number(fields.travelers) < 1) errors.travelers = 'At least 1 traveller is required.';
  if (!fields.date) errors.date = 'Choose a travel date.';
  return { valid: Object.keys(errors).length === 0, errors };
}
