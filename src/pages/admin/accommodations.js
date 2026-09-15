import { accommodations, parksById, money } from '../../services/dataLoader.js';
import { tierLabel } from '../../utilities/helpers.js';
import { iconPlus, iconEdit, iconTrash } from '../../utilities/icons.js';

export function adminAccommodations(){
  const list = accommodations();
  const byId = parksById();
  return `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <div class="h3" style="font-size:17px;">Accommodations</div>
    <button class="btn btn-ochre btn-sm" data-action="admin-new-acc">${iconPlus(14)} New accommodation</button>
  </div>
  <div class="panel" style="padding:22px;">
    <table><thead><tr><th>Name</th><th>Park</th><th>Tier</th><th>Price/night</th><th></th></tr></thead>
    <tbody>${list.map(a=>`<tr><td>${a.name}</td><td>${byId[a.parkId]?.name||''}</td><td>${tierLabel(a.tier)}</td><td>${money(a.price)}</td><td>
      <div class="admin-row-actions">
        <button class="btn btn-ghost btn-sm" data-action="admin-edit-acc" data-id="${a.id}">${iconEdit(14)}</button>
        <button class="btn btn-ghost btn-sm" data-action="admin-delete-acc" data-id="${a.id}">${iconTrash(14)}</button>
      </div>
    </td></tr>`).join('') || `<tr><td colspan="5" style="text-align:center; color:var(--ink-faint);">No accommodations yet.</td></tr>`}</tbody></table>
  </div>`;
}
