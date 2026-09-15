import { packagesById, parksById, money } from '../services/dataLoader.js';
import { tierLabel, transportLabel } from '../utilities/helpers.js';
import { waLink } from '../utilities/channelLinks.js';
import { contact } from '../services/dataLoader.js';

export function pagePackageDetail(id){
  const p = packagesById()[id];
  if(!p) return `<div class="wrap section"><div class="empty-state">Package not found.</div></div>`;
  const byId = parksById();
  return `
  <section class="section wrap">
    <button class="btn btn-ghost btn-sm" data-nav="packages">← Back to packages</button>
    <div class="panel" style="margin-top:18px; overflow:hidden;">
      <div style="height:260px; background-image:url('${p.img}'); background-size:cover; background-position:center; position:relative;">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, transparent 40%, rgba(18,20,15,.88));"></div>
        <div style="position:absolute; bottom:22px; left:28px;">
          <div style="display:flex; gap:8px; margin-bottom:10px;">${p.parks.map(id=>`<span class="pill" style="background:var(--panel-hi);">${byId[id]?.name||id}</span>`).join('')}</div>
          <h1 class="h2">${p.name}</h1>
        </div>
      </div>
      <div style="padding:28px; display:grid; grid-template-columns:1.6fr 1fr; gap:28px;">
        <div>
          <div style="display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap;">
            <span class="pill gold">${p.duration} days</span>
            <span class="pill">${tierLabel(p.accommodationTier)}</span>
            <span class="pill ${p.transport==='jeep'?'green':'clay'}">${transportLabel(p.transport)}</span>
            <span class="pill">★ ${p.rating}</span>
          </div>
          <h3 class="h3">Itinerary</h3>
          <div class="divider"></div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${p.itinerary.map((d,i)=>`<div style="display:flex; gap:14px;"><div style="font-family:var(--font-mono); color:var(--ochre-soft); font-size:13px; width:24px;">${String(i+1).padStart(2,'0')}</div><div style="font-size:14px; color:var(--ink-dim);">${d}</div></div>`).join('')}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:26px;">
            <div><h4 style="font-family:var(--font-mono); font-size:12px; color:var(--ok); text-transform:uppercase; letter-spacing:.5px;">Included</h4><ul style="margin:10px 0 0; padding-left:18px; color:var(--ink-dim); font-size:13.5px; line-height:1.9;">${p.included.map(i=>`<li>${i}</li>`).join('')}</ul></div>
            <div><h4 style="font-family:var(--font-mono); font-size:12px; color:#e6a89f; text-transform:uppercase; letter-spacing:.5px;">Not included</h4><ul style="margin:10px 0 0; padding-left:18px; color:var(--ink-dim); font-size:13.5px; line-height:1.9;">${p.notIncluded.map(i=>`<li>${i}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="panel-hi" style="padding:22px; align-self:start; position:sticky; top:100px;">
          <div class="price" style="font-size:24px;">${money(p.price)} <small>/ person</small></div>
          <p style="font-size:12.5px; margin-top:6px;">Group discounts available on request.</p>
          <button class="btn btn-ochre btn-block" style="margin-top:16px;" data-nav="booking" data-prefill-package="${p.id}">Book this package</button>
          <a class="btn btn-outline btn-block" style="margin-top:10px;" href="${waLink(contact(),'Hi! I have a question about the '+p.name+' package.')}" target="_blank">Ask on WhatsApp</a>
        </div>
      </div>
    </div>
  </section>`;
}
