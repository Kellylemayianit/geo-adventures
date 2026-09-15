import { packages, packagesById, parks, addons, pricingRules, money } from '../services/dataLoader.js';
import { calcCustomPricePerPerson } from '../utilities/booking.js';
import { tierLabel, transportLabel } from '../utilities/helpers.js';

export function pageBooking({ mode, selectedPrebuiltId, builder, groupSize }){
  const toggle = `
  <div class="toggle-group" style="margin-top:20px; width:fit-content;">
    <button class="${mode==='prebuilt'?'active':''}" data-booking-mode="prebuilt">Pre-built package</button>
    <button class="${mode==='custom'?'active':''}" data-booking-mode="custom">Build your own</button>
  </div>`;
  const body = mode==='custom' ? bookingCustomBody(builder) : bookingPrebuiltBody(selectedPrebuiltId, groupSize);
  return `
  <section class="section wrap">
    <div class="eyebrow">Book your safari</div>
    <h1 class="h2" style="margin-top:8px;">Choose how you want to travel</h1>
    ${toggle}
    <div style="margin-top:28px;">${body}</div>
  </section>`;
}

export function bookingPrebuiltBody(id, group=2){
  const PACKAGES = packages();
  const selectedId = id || PACKAGES[0]?.id;
  return `
  <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:26px; align-items:start;">
    <div class="panel" style="padding:22px;">
      <div class="field"><label>Package</label>
        <select id="pb-package">${PACKAGES.map(p=>`<option value="${p.id}" ${p.id===selectedId?'selected':''}>${p.name} — ${money(p.price)}/person</option>`).join('')}</select>
      </div>
      <div class="field-row">
        <div class="field"><label>Full name</label><input id="pb-name" placeholder="Jane Wanjiru"></div>
        <div class="field"><label>Email</label><input id="pb-email" type="email" placeholder="jane@example.com"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Start date</label><input id="pb-date" type="date" min="2026-08-18"></div>
        <div class="field"><label>Group size</label><input id="pb-group" type="number" min="1" value="${group}"></div>
      </div>
      <button class="btn btn-ochre btn-block" id="pb-submit">Submit booking request</button>
    </div>
    <div id="pb-summary">${prebuiltSummary(selectedId, group)}</div>
  </div>`;
}

export function prebuiltSummary(packageId, group){
  const byId = packagesById();
  const p = byId[packageId] || packages()[0];
  const total = p.price * group;
  return `<div class="panel-hi" style="padding:20px;">
    <div class="h3" style="font-size:16px;">${p.name}</div>
    <div class="coord" style="margin-top:6px;">${p.duration} days · ${p.parks.map(id=>byId[id]?.name||id).join(', ')}</div>
    <div class="divider"></div>
    <div style="display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px;"><span>Price per person</span><span>${money(p.price)}</span></div>
    <div style="display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px;"><span>Group size</span><span>${group}</span></div>
    <div class="divider"></div>
    <div style="display:flex; justify-content:space-between; align-items:center;"><span class="h3" style="font-size:15px;">Estimated total</span><span class="price" style="font-size:20px;">${money(total)}</span></div>
  </div>`;
}

export function bookingCustomBody(b){
  const PARKS = parks(), ADDONS = addons();
  return `
  <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:26px; align-items:start;">
    <div class="panel" style="padding:22px;">
      <div class="field"><label>Parks</label>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${PARKS.map(p=>`
          <label class="checkbox-card ${b.parks.includes(p.id)?'checked':''}">
            <input type="checkbox" data-custom-park="${p.id}" ${b.parks.includes(p.id)?'checked':''}>
            <span>${p.name}</span>
          </label>`).join('')}
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Days</label><input id="cb-days" type="number" min="1" value="${b.days}"></div>
        <div class="field"><label>Accommodation</label>
          <select id="cb-tier">${['budget','mid','luxury'].map(t=>`<option value="${t}" ${b.accommodationTier===t?'selected':''}>${tierLabel(t)}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field"><label>Transport</label>
        <select id="cb-transport">${['jeep','motorbike'].map(t=>`<option value="${t}" ${b.transport===t?'selected':''}>${transportLabel(t)}</option>`).join('')}</select>
      </div>
      <div class="field"><label>Add-ons</label>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${ADDONS.map(a=>`
          <label class="checkbox-card ${b.addOns.includes(a.id)?'checked':''}">
            <input type="checkbox" data-custom-addon="${a.id}" ${b.addOns.includes(a.id)?'checked':''}>
            <span style="flex:1;">${a.name}</span><span class="price" style="font-size:13px;">+${money(a.price)}</span>
          </label>`).join('')}
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Full name</label><input id="cb-name" placeholder="Jane Wanjiru"></div>
        <div class="field"><label>Email</label><input id="cb-email" type="email" placeholder="jane@example.com"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Start date</label><input id="cb-date" type="date" min="2026-08-18"></div>
        <div class="field"><label>Group size</label><input id="cb-group" type="number" min="1" value="2"></div>
      </div>
      <button class="btn btn-ochre btn-block" id="cb-submit">Submit custom request</button>
    </div>
    <div id="cb-summary">${customSummary(b)}</div>
  </div>`;
}

export function customSummary(b){
  const byId = Object.fromEntries(parks().map(p=>[p.id,p]));
  const total = calcCustomPricePerPerson(b, pricingRules(), addons());
  return `<div class="panel-hi" style="padding:20px;">
    <div class="h3" style="font-size:16px;">Your custom safari</div>
    <div class="coord" style="margin-top:6px;">${b.parks.length ? b.parks.map(id=>byId[id]?.name.split(' ')[0]).join(', ') : 'No parks selected'}</div>
    <div class="divider"></div>
    <div style="display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px;"><span>Days</span><span>${b.days}</span></div>
    <div style="display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px;"><span>Accommodation</span><span>${tierLabel(b.accommodationTier)}</span></div>
    <div style="display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px;"><span>Transport</span><span>${transportLabel(b.transport)}</span></div>
    <div class="divider"></div>
    <div style="display:flex; justify-content:space-between; align-items:center;"><span class="h3" style="font-size:15px;">Est. per person</span><span class="price" style="font-size:20px;">${money(total)}</span></div>
  </div>`;
}
