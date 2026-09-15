import { icon } from '../../utilities/icons.js';
import { currentUser, signOut } from '../../utilities/auth.js';
import { qs } from '../../utilities/helpers.js';

const CLIENT_LINKS = [
  { label: 'My Bookings', href: '#/dashboard', match: '#/dashboard', icon: 'dashboard' },
  { label: 'Build a Safari', href: '#/build', match: '#/build', icon: 'map' },
  { label: 'Browse Packages', href: '#/packages', match: '#/packages', icon: 'car' },
];

const ADMIN_LINKS = [
  { label: 'Overview', href: '#/admin', match: '#/admin', icon: 'dashboard' },
  { label: 'Bookings', href: '#/admin/bookings', match: '#/admin/bookings', icon: 'clock' },
  { label: 'Packages', href: '#/admin/packages', match: '#/admin/packages', icon: 'map' },
  { label: 'Destinations', href: '#/admin/destinations', match: '#/admin/destinations', icon: 'map' },
];

export function renderSidebar(root, { role, active }){
  const user = currentUser();
  const links = role === 'admin' ? ADMIN_LINKS : CLIENT_LINKS;
  const html = `
    <aside class="dash-sidebar">
      <div class="dash-user">
        <span class="avatar">${(user?.name || '?').charAt(0).toUpperCase()}</span>
        <div>
          <strong>${user?.name || 'Guest'}</strong>
          <span>${role === 'admin' ? 'Administrator' : 'Client'}</span>
        </div>
      </div>
      <nav class="dash-nav">
        ${links.map((l) => `<a href="${l.href}" class="${active === l.match ? 'is-active' : ''}">${icon(l.icon)} ${l.label}</a>`).join('')}
        <a href="#/" id="dash-logout">${icon('logout')} Log out</a>
      </nav>
    </aside>
    <nav class="bottom-nav">
      ${links.map((l) => `<a href="${l.href}" class="${active === l.match ? 'is-active' : ''}">${icon(l.icon)}<span>${l.label}</span></a>`).join('')}
    </nav>
  `;
  root.innerHTML = html;
  qs('#dash-logout', root)?.addEventListener('click', (e) => {
    e.preventDefault();
    signOut();
    window.location.hash = '#/';
  });
}
