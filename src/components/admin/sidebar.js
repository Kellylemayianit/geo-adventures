import { icon } from '../../utilities/icons.js';
import { currentUser, signOut, isStaff } from '../../utilities/auth.js';
import { qs } from '../../utilities/helpers.js';

const ROLE_LABEL = { admin: 'Administrator', moderator: 'Moderator', client: 'Client' };

const CLIENT_LINKS = [
  { label: 'My Bookings', href: '#/dashboard', match: '#/dashboard', icon: 'dashboard' },
  { label: 'Build a Safari', href: '#/build', match: '#/build', icon: 'map' },
  { label: 'Browse Packages', href: '#/packages', match: '#/packages', icon: 'car' },
  { label: 'Change Password', href: '#/account/password', match: '#/account/password', icon: 'user' },
];

const ADMIN_LINKS = [
  { label: 'Overview', href: '#/admin', match: '#/admin', icon: 'dashboard' },
  { label: 'Bookings', href: '#/admin/bookings', match: '#/admin/bookings', icon: 'clock' },
  { label: 'Packages', href: '#/admin/packages', match: '#/admin/packages', icon: 'map' },
  { label: 'Destinations', href: '#/admin/destinations', match: '#/admin/destinations', icon: 'map' },
  { label: 'Users', href: '#/admin/users', match: '#/admin/users', icon: 'users' },
  { label: 'Change Password', href: '#/account/password', match: '#/account/password', icon: 'user' },
];

export function renderSidebar(root, { role, active }){
  const user = currentUser();
  // `role` stays supported for any caller that still passes it explicitly, but the
  // source of truth is always isStaff() - so admins, moderators, and any page that
  // forgets to pass role all land on the correct sidebar.
  const staffView = role ? role !== 'client' : isStaff();
  const links = staffView ? ADMIN_LINKS : CLIENT_LINKS;
  const roleLabel = ROLE_LABEL[user?.role] || (staffView ? 'Staff' : 'Client');
  const html = `
    <aside class="dash-sidebar">
      <div class="dash-user">
        <span class="avatar">${(user?.name || '?').charAt(0).toUpperCase()}</span>
        <div>
          <strong>${user?.name || 'Guest'}</strong>
          <span>${roleLabel}</span>
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
