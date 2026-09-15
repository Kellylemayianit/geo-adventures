import { parks } from '../../services/dataLoader.js';
import { tierLabel } from '../../utilities/helpers.js';
import { iconClose } from '../../utilities/icons.js';

// pass an existing accommodation to edit it, or null to create a new one
export function accommodationFormModal(acc = null){
  const isEdit = !!acc;
  const a = acc || { id:'', name:'', parkId:parks()[0]?.id||'', tier:'mid', price:0, img:'' };
  const allParks = parks();
  return `
  <div class="modal panel" data-acc-form="${isEdit ? a.id : ''}">
    <div class="modal-head">
      <div class="h3" style="font-size:17px;">${isEdit ? 'Edit accommodation' : 'New accommodation'}</div>
      <button class="btn btn-ghost btn-sm" data-action="close-modal">${iconClose(16)}</button>
    </div>
    <div class="modal-body">
      <div class="field"><label>Name</label><input id="af-name" value="${a.name}" placeholder="Kilima Tented Camp"></div>
      <div class="field"><label>Image URL</label><input id="af-img" value="${a.img}" placeholder="https://..."></div>
      <div class="field-row">
        <div class="field"><label>Park</label>
          <select id="af-park">${allParks.map(pk=>`<option value="${pk.id}" ${a.parkId===pk.id?'selected':''}>${pk.name}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Tier</label>
          <select id="af-tier">${['budget','mid','luxury'].map(t=>`<option value="${t}" ${a.tier===t?'selected':''}>${tierLabel(t)}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field"><label>Price / night (USD)</label><input id="af-price" type="number" min="0" value="${a.price}"></div>
    </div>
    <div class="modal-foot">
      ${isEdit ? `<button class="btn btn-danger btn-sm" data-action="admin-delete-acc" data-id="${a.id}" style="margin-right:auto;">Delete</button>` : ''}
      <button class="btn btn-outline btn-sm" data-action="close-modal">Cancel</button>
      <button class="btn btn-ochre btn-sm" data-action="admin-save-acc" data-id="${a.id}">${isEdit ? 'Save changes' : 'Create accommodation'}</button>
    </div>
  </div>`;
}
