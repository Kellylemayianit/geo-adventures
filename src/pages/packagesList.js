import { packages, parks, parksById } from '../services/dataLoader.js';
import { packageCard } from '../components/card.js';

export function pagePackagesList(activeFilter){
  const PACKAGES = packages();
  const list = activeFilter==='all' ? PACKAGES : PACKAGES.filter(p=>p.parks.includes(activeFilter));
  const filterIds = ['all', ...parks().map(p=>p.id)];
  const byId = parksById();
  return `
  <section class="section wrap">
    <div class="eyebrow">All routes</div>
    <h1 class="h2" style="margin-top:8px;">Pre-built safari packages</h1>
    <p style="margin-top:8px; max-width:560px;">Fixed itineraries with set pricing. Prefer to choose your own parks, nights, and add-ons? <a class="link-underline" data-nav="booking">Use the custom builder</a>.</p>
    <div class="filter-bar panel" style="margin-top:22px;">
      ${filterIds.map(f=>`<div class="chip ${activeFilter===f?'active':''}" data-filter-package="${f}">${f==='all'?'All parks':byId[f].name.split(' ')[0]}</div>`).join('')}
    </div>
    <div class="grid grid-3">${list.map(packageCard).join('') || `<div class="empty-state">No packages match this filter.</div>`}</div>
  </section>`;
}
