import { qs } from '../utilities/helpers.js';
import { formatMoney, showToast } from '../utilities/helpers.js';
import { validateBookingFields } from '../utilities/booking.js';
import { waLink, buildEnquiryMessage } from '../utilities/channelLinks.js';
import { createBooking } from '../services/dataLoader.js';
import { currentUser } from '../utilities/auth.js';

/**
 * Renders the sticky booking panel used on package detail + build-your-own pages.
 * @param {Object} opts
 * @param {string} opts.title
 * @param {number} opts.total          total price in KES
 * @param {Array}  opts.lines          [{label, value}] priced breakdown lines
 * @param {string} opts.ctaLabel
 */
export function renderBookingPanel({ title, total, lines = [], ctaLabel = 'Request to Book' }){
  const user = currentUser();
  return `
    <div class="booking-panel" id="booking-panel">
      <h4>${title}</h4>
      <div class="booking-price">${formatMoney(total)} <small>total, all travellers</small></div>
      <div style="margin:1rem 0">
        ${lines.map((l) => `<div class="booking-line"><span>${l.label}</span><span>${l.value}</span></div>`).join('')}
        <div class="booking-line total"><span>Total</span><span>${formatMoney(total)}</span></div>
      </div>
      <form id="booking-form" novalidate>
        <div class="field-group">
          <label class="field-label" for="bf-name">Full name</label>
          <input class="text-field" id="bf-name" name="name" value="${user?.name || ''}" required>
          <span class="field-error" data-error-for="name" hidden></span>
        </div>
        <div class="field-group">
          <label class="field-label" for="bf-phone">Phone (M-Pesa/WhatsApp)</label>
          <input class="text-field" id="bf-phone" name="phone" placeholder="0113556385" value="${user?.phone || ''}" required>
          <span class="field-error" data-error-for="phone" hidden></span>
        </div>
        <div class="field-group">
          <label class="field-label" for="bf-email">Email (optional)</label>
          <input class="text-field" id="bf-email" name="email" type="email" value="${user?.email || ''}">
          <span class="field-error" data-error-for="email" hidden></span>
        </div>
        <div class="field-group">
          <label class="field-label" for="bf-date">Preferred travel date</label>
          <input class="text-field" id="bf-date" name="date" type="date" required>
          <span class="field-error" data-error-for="date" hidden></span>
        </div>
        <button class="btn btn-primary btn-block" type="submit">${ctaLabel}</button>
        <p class="muted" style="font-size:.8rem;margin-top:.8rem">We confirm every booking over WhatsApp or phone before anything is finalised.</p>
      </form>
    </div>
  `;
}

/**
 * Wires the booking form's submit handler.
 * @param {HTMLElement} root
 * @param {Function} getBookingPayload  () => object describing the booking (excluding contact fields)
 */
export function wireBookingForm(root, getBookingPayload){
  const form = qs('#booking-form', root);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const fields = Object.fromEntries(fd.entries());
    fields.travelers = fields.travelers || 1;

    const { valid, errors } = validateBookingFields(fields);
    Array.from(form.querySelectorAll('[data-error-for]')).forEach((el) => { el.hidden = true; el.textContent = ''; });
    if (!valid){
      Object.entries(errors).forEach(([key, msg]) => {
        const el = form.querySelector(`[data-error-for="${key}"]`);
        if (el){ el.hidden = false; el.textContent = msg; }
      });
      return;
    }

    const payload = getBookingPayload();
    const user = currentUser();
    const booking = {
      id: 'bk' + Date.now(),
      userId: user?.id || null,
      name: fields.name,
      phone: fields.phone,
      email: fields.email || '',
      date: fields.date,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    await createBooking(booking);

    const message = buildEnquiryMessage({
      title: payload.title,
      kind: payload.type,
      details: `Traveller: ${fields.name} (${fields.phone})\nDate: ${fields.date}\nTotal: ${formatMoney(payload.totalKes)}`,
    });
    showToast('Booking request saved — opening WhatsApp to confirm.', 'success');
    window.open(waLink(message), '_blank');
    form.reset();
  });
}
