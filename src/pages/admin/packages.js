import { packages, money } from '../../services/dataLoader.js';
import { iconPlus, iconEdit, iconTrash } from '../../utilities/icons.js';

export function adminPackages(){
  const list = packages();
  return `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <div class="h3" style="font-size:17px;">Packages</div>
    <button class="btn btn-ochre btn-sm" data-action="admin-new-package">${iconPlus(14)} New package</button>
  </div>
  <div class="grid grid-3">${list.map(p=>`
    <div class="card panel">
      <div class="card-img" style="background-image:url('${p.img}')"></div>
      <div class="card-body">
        <div class="card-title" style="font-size:16px;">${p.name}</div>
        <div class="card-foot">
          <span class="price">${money(p.price)}</span>
          <div class="admin-row-actions">
            <button class="btn btn-ghost btn-sm" data-action="admin-edit-package" data-id="${p.id}">${iconEdit(14)} Edit</button>
            <button class="btn btn-ghost btn-sm" data-action="admin-delete-package" data-id="${p.id}">${iconTrash(14)}</button>
          </div>
        </div>
      </div>
    </div>`).join('') || `<div class="empty-state">No packages yet — create the first one.</div>`}</div>`;
}
