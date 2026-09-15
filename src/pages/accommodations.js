import { accommodations } from '../services/dataLoader.js';
import { accommodationCard } from '../components/card.js';

const TIERS = ['all','budget','mid','luxury'];
const LABELS = { all:'All tiers', budget:'Budget', mid:'Mid-range', luxury:'Luxury' };

export function pageAccommodations(activeTier){
  const list = activeTier==='all' ? accommodations() : accommodations().filter(a=>a.tier===activeTier);
  return `
  <section class="section wrap">
    <div class="eyebrow">Lodges &amp; camps</div>
    <h1 class="h2" style="margin-top:8px;">Accommodations</h1>
    <p style="margin-top:8px;">Every stay is available inside packages or as part of a custom itinerary.</p>
    <div class="filter-bar panel" style="margin-top:22px;">
      ${TIERS.map(t=>`<div class="chip ${activeTier===t?'active':''}" data-filter-acc="${t}">${LABELS[t]}</div>`).join('')}
    </div>
    <div class="grid grid-4">${list.map(accommodationCard).join('') || `<div class="empty-state">No accommodations at this tier.</div>`}</div>
  </section>`;
}
