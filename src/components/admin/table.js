import { money } from '../../services/dataLoader.js';
import { fmtDate } from '../../utilities/helpers.js';

export function bookingsTable(list, packagesById){
  return `<table><thead><tr><th>ID</th><th>Package</th><th>Guest</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
  <tbody>${list.map(b=>`<tr><td>${b.id}</td><td>${packagesById[b.packageId]?.name||'Custom'}</td><td>${b.guestEmail}</td><td>${fmtDate(b.startDate)}</td><td>${money(b.totalPrice)}</td><td><span class="status-badge status-${b.status}">${b.status}</span></td></tr>`).join('')}</tbody></table>`;
}
