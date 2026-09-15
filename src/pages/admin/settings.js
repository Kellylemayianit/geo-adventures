import { settings, listCurrencies } from '../../services/dataLoader.js';

export function adminSettings(){
  const s = settings();
  const currencies = listCurrencies();
  return `<div class="panel" style="padding:24px; max-width:520px;">
    <div class="field"><label>Company name</label><input id="admin-set-company" value="${s.companyName||''}"></div>
    <div class="field"><label>Contact email</label><input id="admin-set-email" value="${s.contactEmail||''}"></div>
    <div class="field"><label>WhatsApp number</label><input id="admin-set-whatsapp" value="${s.whatsappNumber||''}"></div>
    <div class="field"><label>Default currency for new visitors</label>
      <select id="admin-set-currency">${Object.values(currencies).map(c=>`<option value="${c.code}" ${s.defaultCurrency===c.code?'selected':''}>${c.code} — ${c.label}</option>`).join('')}</select>
    </div>
    <button class="btn btn-ochre" data-action="admin-save-settings">Save changes</button>
  </div>`;
}
