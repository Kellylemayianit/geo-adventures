import { parks } from '../../services/dataLoader.js';
import { tierLabel, transportLabel } from '../../utilities/helpers.js';
import { iconClose } from '../../utilities/icons.js';

// pass an existing package to edit it, or null to create a new one
export function packageFormModal(pkg = null){
  const isEdit = !!pkg;
  const p = pkg || { id:'', name:'', parks:[], img:'', duration:3, price:0, rating:4.5, accommodationTier:'mid', transport:'jeep', itinerary:[], included:[], notIncluded:[] };
  const allParks = parks();
  return `
  <div class="modal panel" data-package-form="${isEdit ? p.id : ''}">
    <div class="modal-head">
      <div class="h3" style="font-size:17px;">${isEdit ? 'Edit package' : 'New package'}</div>
      <button class="btn btn-ghost btn-sm" data-action="close-modal">${iconClose(16)}</button>
    </div>
    <div class="modal-body">
      <div class="field"><label>Name</label><input id="pf-name" value="${p.name}" placeholder="Great Migration Explorer"></div>
      <div class="field"><label>Image URL</label><input id="pf-img" value="${p.img}" placeholder="https://..."></div>
      <div class="field"><label>Parks covered</label>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${allParks.map(pk=>`<label class="checkbox-card ${p.parks.includes(pk.id)?'checked':''}">
            <input type="checkbox" id="pf-park-${pk.id}" value="${pk.id}" ${p.parks.includes(pk.id)?'checked':''}>
            <span>${pk.name}</span></label>`).join('')}
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Duration (days)</label><input id="pf-duration" type="number" min="1" value="${p.duration}"></div>
        <div class="field"><label>Price / person (USD)</label><input id="pf-price" type="number" min="0" value="${p.price}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Accommodation tier</label>
          <select id="pf-tier">${['budget','mid','luxury'].map(t=>`<option value="${t}" ${p.accommodationTier===t?'selected':''}>${tierLabel(t)}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Transport</label>
          <select id="pf-transport">${['jeep','motorbike'].map(t=>`<option value="${t}" ${p.transport===t?'selected':''}>${transportLabel(t)}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field"><label>Rating</label><input id="pf-rating" type="number" min="1" max="5" step="0.1" value="${p.rating}"></div>
      <div class="field"><label>Itinerary (one step per line)</label><textarea id="pf-itinerary">${p.itinerary.join('\n')}</textarea></div>
      <div class="field-row">
        <div class="field"><label>Included (one per line)</label><textarea id="pf-included">${p.included.join('\n')}</textarea></div>
        <div class="field"><label>Not included (one per line)</label><textarea id="pf-not-included">${p.notIncluded.join('\n')}</textarea></div>
      </div>
    </div>
    <div class="modal-foot">
      ${isEdit ? `<button class="btn btn-danger btn-sm" data-action="admin-delete-package" data-id="${p.id}" style="margin-right:auto;">Delete</button>` : ''}
      <button class="btn btn-outline btn-sm" data-action="close-modal">Cancel</button>
      <button class="btn btn-ochre btn-sm" data-action="admin-save-package" data-id="${p.id}">${isEdit ? 'Save changes' : 'Create package'}</button>
    </div>
  </div>`;
}
