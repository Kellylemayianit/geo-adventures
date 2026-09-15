import { qs, qsa } from '../utilities/helpers.js';
import { icon } from '../utilities/icons.js';
import { CONTACT, telLink, mailtoLink } from '../utilities/channelLinks.js';
import { currentUser, signOut } from '../utilities/auth.js';

const NAV_ITEMS = [
  { label: 'Home', href: '#/' },
  { label: 'About', href: '#/about' },
  {
    label: 'Safaris', href: '#/packages',
    children: [
      { label: 'Safari Packages', href: '#/packages' },
      { label: 'Build Your Own', href: '#/build' },
    ],
  },
  {
    label: 'Destinations', href: '#/destinations',
    children: [
      { label: 'All Destinations', href: '#/destinations' },
    ],
  },
  { label: 'Stories', href: '#/stories' },
  { label: 'Team', href: '#/team' },
  { label: 'Contact', href: '#/contact' },
];

export function renderHeader(root, activeRoute = ''){
  const user = currentUser();

  const navHtml = NAV_ITEMS.map((item) => {
    const isActive = activeRoute === item.href || (item.children && item.children.some((c) => c.href === activeRoute));
    if (item.children){
      return `
        <li class="has-dropdown">
          <a class="nav-link ${isActive ? 'is-active' : ''}" href="${item.href}" data-dropdown-trigger>${item.label}</a>
          <ul class="dropdown-menu">
            ${item.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join('')}
          </ul>
        </li>`;
    }
    return `<li><a class="nav-link ${isActive ? 'is-active' : ''}" href="${item.href}">${item.label}</a></li>`;
  }).join('');

  const authHtml = user
    ? `
      <a class="user-chip" href="${user.role === 'admin' ? '#/admin' : '#/dashboard'}">
        <span class="avatar">${user.name.charAt(0).toUpperCase()}</span> ${user.name.split(' ')[0]}
      </a>
      <button class="icon-btn" id="btn-logout" title="Log out" aria-label="Log out">${icon('logout')}</button>`
    : `<a class="icon-btn" href="#/login" title="Log in" aria-label="Log in">${icon('user')}</a>`;

  root.innerHTML = `
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <span>${icon('map')} ${CONTACT.location}</span>
          <a href="${mailtoLink()}">${icon('mail')} ${CONTACT.email}</a>
        </div>
        <div class="topbar-social flex-center">
          <a href="${telLink()}">${icon('phone')} ${CONTACT.phoneDisplay}</a>
          <a href="${CONTACT.facebook}" aria-label="Facebook"><i class="fa fa-facebook"></i>FB</a>
          <a href="${CONTACT.instagram}" aria-label="Instagram">IG</a>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container">
        <a class="brand" href="#/"><span class="brand-mark">Geo</span> Adventures <span class="brand-sub">Kenya</span></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" id="main-nav">
          <ul>${navHtml}</ul>
        </nav>
        <div class="nav-actions">
          ${authHtml}
          <a class="btn btn-amber btn-sm" href="#/build">Build a Safari</a>
        </div>
      </div>
    </header>
  `;

  wireHeader(root);
}

function wireHeader(root){
  const toggle = qs('#nav-toggle', root);
  const nav = qs('#main-nav', root);
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  qsa('[data-dropdown-trigger]', root).forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth > 991) return;
      e.preventDefault();
      trigger.closest('.has-dropdown').classList.toggle('is-open');
    });
  });

  qs('#btn-logout', root)?.addEventListener('click', () => {
    signOut();
    window.location.hash = '#/';
  });
}
