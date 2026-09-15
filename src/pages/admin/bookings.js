import { bookings, packagesById, money } from '../../services/dataLoader.js';
import { fmtDate } from '../../utilities/helpers.js';

const FILTERS = ['all','pending','confirmed','cancelled'];

export function adminBookings(filter){
  const list = filter==='all' ? bookings() : bookings().filter(b=>b.status===filter);
  const byId = packagesById();
  return `
  <div class="filter-bar panel">
    ${FILTERS.map(f=>`<div class="chip ${filter===f?'active':''}" data-filter-admin-booking="${f}">${f[0].toUpperCase()+f.slice(1)}</div>`).join('')}
  </div>
  <div class="panel" style="padding:22px; margin-top:18px;">
    <table><thead><tr><th>ID</th><th>Package</th><th>Guest</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>${list.map(b=>`<tr><td>${b.id}</td><td>${byId[b.packageId]?.name||'Custom'}</td><td>${b.guestEmail}</td><td>${fmtDate(b.startDate)}</td><td>${money(b.totalPrice)}</td><td>
      <select data-admin-status="${b.id}" style="background:var(--bg); color:var(--ink); border:1px solid var(--line-hi); border-radius:var(--radius); padding:4px 6px; font-size:12px;">
        ${['pending','confirmed','cancelled'].map(s=>`<option value="${s}" ${b.status===s?'selected':''}>${s}</option>`).join('')}
      </select></td></tr>`).join('') || `<tr><td colspan="6" style="text-align:center; color:var(--ink-faint);">No bookings in this filter.</td></tr>`}</tbody></table>
  </div>`;
}
