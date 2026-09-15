/* ==========================================================
   BOOKING — form validation + custom-safari price calculator.
   ========================================================== */
export function validateBooking({name,email,date,group,parks}){
  const errors=[];
  if(!name||!name.trim()) errors.push('Full name is required.');
  if(!email||!/^\S+@\S+\.\S+$/.test(email)) errors.push('A valid email is required.');
  if(!date) errors.push('Start date is required.');
  if(!group||group<1) errors.push('Group size must be at least 1.');
  if(parks && parks.length===0) errors.push('Select at least one park.');
  return errors;
}

export function calcCustomPricePerPerson(builder, pricingRules, addonsList){
  const accMult = pricingRules.accommodationMultiplier[builder.accommodationTier] || 1;
  const transMult = pricingRules.transportMultiplier[builder.transport] || 1;
  let total = pricingRules.basePricePerParkPerDay * Math.max(builder.parks.length,1) * builder.days * accMult * transMult;
  builder.addOns.forEach(id=>{ const a = addonsList.find(a=>a.id===id); if(a) total += a.price; });
  return Math.round(total);
}
