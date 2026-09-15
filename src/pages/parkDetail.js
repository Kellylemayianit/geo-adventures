import { parksById, packages, accommodations, reviews, money } from '../services/dataLoader.js';

export function pageParkDetail(id){
  const pk = parksById()[id];
  if(!pk) return `<div class="wrap section"><div class="empty-state">Park not found.</div></div>`;
  const pkgs = packages().filter(p=>p.parks.includes(id));
  const stays = accommodations().filter(a=>a.parkId===id);
  const parkReviews = reviews().filter(r=>r.parkId===id);
  return `
  <section class="section wrap">
    <button class="btn btn-ghost btn-sm" data-nav="parks">← Back to parks</button>
    <div style="margin-top:18px; border-radius:var(--radius); overflow:hidden; height:280px; background-image:url('${pk.img}'); background-size:cover; background-position:center; position:relative; border:1px solid var(--line);">
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, transparent 30%, rgba(18,20,15,.92));"></div>
      <div style="position:absolute; bottom:22px; left:28px;">
        <div class="coord" style="color:#fff; opacity:.8;">${pk.coord}</div>
        <h1 class="h2" style="margin-top:6px;">${pk.name}</h1>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1.6fr 1fr; gap:26px; margin-top:26px;">
      <div>
        <p style="font-size:15px;">${pk.description}</p>
        <div class="grid grid-2" style="margin-top:20px; gap:12px;">
          <div class="panel" style="padding:14px;"><div class="eyebrow">Best time</div><div class="h3" style="font-size:17px; margin-top:6px;">${pk.bestTime}</div></div>
          <div class="panel" style="padding:14px;"><div class="eyebrow">Entrance fee</div><div class="h3" style="font-size:17px; margin-top:6px;">${money(pk.entranceFee)}/day</div></div>
        </div>
        <h4 style="font-family:var(--font-mono); font-size:12px; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-faint); margin-top:24px;">Highlights</h4>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">${pk.highlights.map(h=>`<span class="pill gold">${h}</span>`).join('')}</div>
        <h4 style="font-family:var(--font-mono); font-size:12px; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-faint); margin-top:20px;">Wildlife</h4>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">${pk.wildlife.map(h=>`<span class="pill">${h}</span>`).join('')}</div>
        ${parkReviews.length?`
        <h4 style="font-family:var(--font-mono); font-size:12px; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-faint); margin-top:26px;">Guest reviews</h4>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
          ${parkReviews.map(r=>`<div class="panel" style="padding:14px 16px;"><div style="font-size:13.5px; color:var(--ink);">"${r.comment}"</div><div style="font-size:11.5px; color:var(--ink-faint); margin-top:6px;">${r.guestName} · ★${r.rating}</div></div>`).join('')}
        </div>`:''}
      </div>
      <div class="panel-hi" style="padding:20px; align-self:start; position:sticky; top:100px;">
        <div class="h3" style="font-size:16px;">Stay here</div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
          ${stays.slice(0,3).map(a=>`<div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;"><span>${a.name}</span><span class="price" style="font-size:13px;">${money(a.price)}/night</span></div>`).join('')}
        </div>
        <button class="btn btn-outline btn-block" style="margin-top:16px;" data-nav="accommodations">All stays →</button>
        <div class="divider"></div>
        <div class="h3" style="font-size:16px;">Packages here</div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
          ${pkgs.map(p=>`<div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; cursor:pointer;" data-nav="package-detail" data-id="${p.id}"><span>${p.name}</span><span class="price" style="font-size:13px;">${money(p.price)}</span></div>`).join('')||'<div style="font-size:12.5px; color:var(--ink-faint);">None yet — try the custom builder.</div>'}
        </div>
        <button class="btn btn-ochre btn-block" style="margin-top:16px;" data-nav="booking">Build a safari here</button>
      </div>
    </div>
  </section>`;
}
