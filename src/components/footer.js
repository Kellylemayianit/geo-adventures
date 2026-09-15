import { icon } from '../utilities/icons.js';
import { CONTACT, waLink, telLink, mailtoLink, buildEnquiryMessage } from '../utilities/channelLinks.js';

export function renderFooter(root){
  root.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-top">
        <div class="footer-brand">
          <a class="brand" href="#/"><span class="brand-mark">Geo</span> Adventures <span class="brand-sub">Kenya</span></a>
          <p>Based in Kimana, running safaris across Amboseli, the Mara, Tsavo and the wider Rift Valley — parks, stays and transport, packaged together or built your way.</p>
          <div class="footer-social">
            <a href="${CONTACT.facebook}" aria-label="Facebook"><i class="fa fa-facebook"></i>f</a>
            <a href="${CONTACT.instagram}" aria-label="Instagram">ig</a>
            <a href="${waLink(buildEnquiryMessage({ title: 'general enquiry' }))}" aria-label="WhatsApp">${icon('whatsapp')}</a>
          </div>
        </div>
        <div>
          <h5>Explore</h5>
          <ul>
            <li><a href="#/packages">Safari Packages</a></li>
            <li><a href="#/build">Build Your Own</a></li>
            <li><a href="#/destinations">Destinations</a></li>
            <li><a href="#/stories">Stories</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="#/about">About Us</a></li>
            <li><a href="#/team">Our Team</a></li>
            <li><a href="#/contact">Contact</a></li>
            <li><a href="#/login">Sign In</a></li>
          </ul>
        </div>
        <div>
          <h5>Reach Us</h5>
          <ul class="footer-contact">
            <li>${icon('map')} ${CONTACT.location}</li>
            <li><a href="${telLink()}">${icon('phone')} ${CONTACT.phoneDisplay}</a></li>
            <li><a href="${mailtoLink()}">${icon('mail')} ${CONTACT.email}</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; ${new Date().getFullYear()} Geo Adventures Kenya. All rights reserved.</span>
        <span>Proudly based in Kimana.</span>
      </div>
    </footer>
    <a class="whatsapp-fab" href="${waLink(buildEnquiryMessage({ title: 'general enquiry' }))}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      ${icon('whatsapp')}
    </a>
  `;
}
