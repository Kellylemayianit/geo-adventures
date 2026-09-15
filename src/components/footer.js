import { contact } from '../services/dataLoader.js';
import { waLink, mailLink } from '../utilities/channelLinks.js';
import { iconWhatsapp, iconMail } from '../utilities/icons.js';

export function siteFooter(){
  const c = contact();
  return `
  <footer class="site">
    <div class="wrap footer-panel">
      <div>
        <div class="brand" style="margin-bottom:10px;"><span class="mark">GA</span> ${c.companyName || 'Geo Adventures'}</div>
        <p style="max-width:260px; font-size:13px;">Prototype build — not the production site. Layout &amp; data are illustrative.</p>
        <div class="channel-links">
          <a href="${waLink(c,'Hi! I have a question about a safari.')}" target="_blank" title="WhatsApp">${iconWhatsapp(16)}</a>
          <a href="${mailLink(c)}" title="Email">${iconMail(16)}</a>
        </div>
      </div>
      <div class="footer-cols">
        <div class="footer-col"><h4>Explore</h4><a data-nav="parks">Parks</a><a data-nav="packages">Packages</a><a data-nav="accommodations">Stays</a></div>
        <div class="footer-col"><h4>Account</h4><a data-nav="login">Log in</a><a data-nav="register">Sign up</a></div>
        <div class="footer-col"><h4>Contact</h4><div>${c.email}</div><div>${c.phone || ''}</div></div>
      </div>
    </div>
  </footer>`;
}
