import { packages, parks, reviews, parksById } from '../services/dataLoader.js';
import { packageCard, parkCard } from '../components/card.js';

export function pageHome(){
  const PACKAGES = packages(), PARKS = parks();
  const featured = PACKAGES.slice(0,3);
  const featuredPark = PARKS[1] || PARKS[0];
  const review = reviews()[0];
  const byId = parksById();
  return `
  <section class="hero wrap">
    <div class="hero-panel panel">
      <div class="hero-copy">
        <div class="eyebrow">Kenya · East Africa</div>
        <h1 class="h1" style="margin-top:10px;">Safaris built around the ground beneath them.</h1>
        <p class="lead">${PACKAGES.length} routes across Amboseli, the Maasai Mara, and Tsavo. Pick a fixed itinerary or draw your own from the map.</p>
        <div class="hero-cta">
          <button class="btn btn-ochre" data-nav="packages">Browse packages</button>
          <button class="btn btn-outline" data-nav="booking">Build your own</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><div class="num">${PACKAGES.length}</div><div class="lbl">Packages</div></div>
          <div class="hero-stat"><div class="num">${PARKS.length}</div><div class="lbl">Parks</div></div>
          <div class="hero-stat"><div class="num">4.7</div><div class="lbl">Avg rating</div></div>
        </div>
      </div>
      <div class="hero-visual">
        <svg viewBox="0 0 400 320" preserveAspectRatio="none"><g fill="none" stroke="var(--ochre-soft)" stroke-width="1"><ellipse cx="200" cy="160" rx="60" ry="40"/><ellipse cx="200" cy="160" rx="100" ry="70"/><ellipse cx="200" cy="160" rx="140" ry="100"/><ellipse cx="200" cy="160" rx="180" ry="130"/></g></svg>
        <div class="float-card panel-hi">
          <div class="coord">${featuredPark.coord}</div>
          <div class="h3" style="font-size:16px; margin-top:4px;">${featuredPark.name}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section wrap">
    <div class="section-head">
      <div><div class="eyebrow">Signature routes</div><h2 class="h2" style="margin-top:8px;">Featured packages</h2></div>
      <button class="btn btn-outline btn-sm" data-nav="packages">View all →</button>
    </div>
    <div class="grid grid-3">${featured.map(packageCard).join('')}</div>
  </section>

  <section class="section wrap" style="padding-top:0;">
    <div class="section-head">
      <div><div class="eyebrow">Where you'll go</div><h2 class="h2" style="margin-top:8px;">The four parks</h2></div>
      <button class="btn btn-outline btn-sm" data-nav="parks">Explore parks →</button>
    </div>
    <div class="grid grid-4">${PARKS.map(parkCard).join('')}</div>
  </section>

  ${review ? `
  <section class="section wrap" style="padding-top:0;">
    <div class="panel-hi" style="padding:36px; display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap;">
      <div>
        <div class="eyebrow">Guest voices</div>
        <h3 class="h3" style="margin-top:8px; max-width:520px;">${review.comment}</h3>
        <p style="margin-top:10px; font-size:13px;">— ${review.guestName}, ${byId[review.parkId]?.name||''}</p>
      </div>
      <button class="btn btn-ochre" data-nav="booking">Start planning</button>
    </div>
  </section>` : ''}`;
}
