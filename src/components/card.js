import { parksById, money } from '../services/dataLoader.js';
import { tierLabel, fmtDate } from '../utilities/helpers.js';

export function packageCard(p){
  const byId = parksById();
  return `<div class="card panel">
    <div class="card-img" style="background-image:url('${p.img}')"><span class="tag">${p.duration} days</span></div>
    <div class="card-body">
      <div class="card-title">${p.name}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${p.parks.map(id=>`<span class="pill">${(byId[id]?.name||id).split(' ')[0]}</span>`).join('')}
        <span class="pill gold">★ ${p.rating}</span>
      </div>
      <div class="card-foot">
        <span class="price">${money(p.price)} <small>/ person</small></span>
        <button class="btn btn-outline btn-sm" data-nav="booking" data-prefill-package="${p.id}">Book →</button>
      </div>
    </div>
  </div>`;
}

export function parkCard(p){
  return `<div class="card panel" data-nav="park-detail" data-id="${p.id}" style="cursor:pointer;">
    <div class="card-img" style="background-image:url('${p.img}')"></div>
    <div class="card-body">
      <div class="card-title">${p.name.replace(' National Park','').replace(' National Reserve','')}</div>
      <div class="coord">${p.coord}</div>
    </div>
  </div>`;
}

export function accommodationCard(a){
  const byId = parksById();
  return `<div class="card panel">
    <div class="card-img" style="background-image:url('${a.img}')"><span class="tag">${tierLabel(a.tier)}</span></div>
    <div class="card-body">
      <div class="card-title" style="font-size:16px;">${a.name}</div>
      <div class="coord">${byId[a.parkId]?.name||''}</div>
      <div class="card-foot"><span class="price">${money(a.price)} <small>/ night</small></span></div>
    </div>
  </div>`;
}

export function bookingCard(b, packagesById){
  const p = packagesById[b.packageId];
  return `<div class="panel" style="padding:16px 18px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
      <div>
        <div class="card-title" style="font-size:16px;">${p?.name||'Custom safari'}</div>
        <div class="coord" style="margin-top:4px;">${fmtDate(b.startDate)} · ${b.groupSize} guests · ${b.id}</div>
      </div>
      <span class="status-badge status-${b.status}">${b.status}</span>
    </div>
    <div class="card-foot"><span class="price">${money(b.totalPrice)}</span></div>
  </div>`;
}
