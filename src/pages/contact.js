import { render, qs, showToast } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { icon } from '../utilities/icons.js';
import { CONTACT, waLink, telLink, mailtoLink, buildEnquiryMessage } from '../utilities/channelLinks.js';

export async function mount(container){
  render(container, `
    ${renderPageBanner({ image: 'https://commons.wikimedia.org/wiki/Special:FilePath/1993_158-11A_Masai_Mara_sunset.jpg', title: 'Contact Us', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Contact' }] })}
    <section class="section">
      <div class="container grid grid-2" style="align-items:start">
        <div>
          <span class="eyebrow">Talk to us directly</span>
          <h2>We're easiest to reach on WhatsApp</h2>
          <p class="muted">Send a message here and it opens straight into WhatsApp with your details filled in — or call/email us using the details below.</p>
          <ul style="margin-top:1.5rem">
            <li class="flex gap-sm" style="margin-bottom:1rem"><span style="color:var(--green-600)">${icon('map')}</span> ${CONTACT.location}</li>
            <li class="flex gap-sm" style="margin-bottom:1rem"><a class="flex gap-sm" href="${telLink()}"><span style="color:var(--green-600)">${icon('phone')}</span> ${CONTACT.phoneDisplay}</a></li>
            <li class="flex gap-sm"><a class="flex gap-sm" href="${mailtoLink()}"><span style="color:var(--green-600)">${icon('mail')}</span> ${CONTACT.email}</a></li>
          </ul>
          <a class="btn btn-primary" style="margin-top:1.5rem;background:#25D366;border-color:#25D366" href="${waLink(buildEnquiryMessage({ title: 'general enquiry' }))}" target="_blank" rel="noopener">${icon('whatsapp')} Chat on WhatsApp</a>
        </div>

        <form id="contact-form" class="booking-panel" novalidate>
          <h4>Send an enquiry</h4>
          <div class="field-group">
            <label class="field-label" for="cf-name">Full name</label>
            <input class="text-field" id="cf-name" name="name" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="cf-phone">Phone</label>
            <input class="text-field" id="cf-phone" name="phone" placeholder="0113556385" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="cf-message">What are you planning?</label>
            <textarea class="text-field" id="cf-message" name="message" rows="4" required></textarea>
          </div>
          <button class="btn btn-primary btn-block" type="submit">${icon('whatsapp')} Send via WhatsApp</button>
        </form>
      </div>
    </section>
  `);

  qs('#contact-form', container).addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fields = Object.fromEntries(fd.entries());
    if (!fields.name || !fields.phone || !fields.message){
      showToast('Please fill in your name, phone and message.', 'error');
      return;
    }
    const message = buildEnquiryMessage({ title: 'website contact form', details: `${fields.name} (${fields.phone}):\n${fields.message}` });
    window.open(waLink(message), '_blank');
    e.target.reset();
  });
}
