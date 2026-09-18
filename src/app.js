import { defineRoutes, onRouteChange, startRouter, navigate } from './router.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderAppBar } from './components/appBar.js';
import { qs, showToast } from './utilities/helpers.js';
import { isLoggedIn, isAdmin } from './utilities/auth.js';

const ROUTES = [
  { path: '/', load: () => import('./pages/home.js') },
  { path: '/about', load: () => import('./pages/about.js') },
  { path: '/destinations', load: () => import('./pages/destinations.js') },
  { path: '/destinations/:slug', load: () => import('./pages/destinationDetail.js') },
  { path: '/packages', load: () => import('./pages/packages.js') },
  { path: '/packages/:slug', load: () => import('./pages/packageDetail.js') },
  { path: '/build', load: () => import('./pages/buildYourOwn.js') },
  { path: '/team', load: () => import('./pages/team.js') },
  { path: '/stories', load: () => import('./pages/stories.js') },
  { path: '/stories/:slug', load: () => import('./pages/storyDetail.js') },
  { path: '/contact', load: () => import('./pages/contact.js') },
  { path: '/login', load: () => import('./pages/login.js') },
  { path: '/signup', load: () => import('./pages/signup.js') },
  { path: '/dashboard', load: () => import('./pages/dashboard/clientDashboard.js'), auth: 'client' },
  { path: '/account/password', load: () => import('./pages/account/changePassword.js'), auth: 'client' },
  { path: '/admin', load: () => import('./pages/dashboard/adminDashboard.js'), auth: 'admin' },
  { path: '/admin/bookings', load: () => import('./pages/dashboard/adminBookings.js'), auth: 'admin' },
  { path: '/admin/packages', load: () => import('./pages/dashboard/adminPackages.js'), auth: 'admin' },
  { path: '/admin/destinations', load: () => import('./pages/dashboard/adminDestinations.js'), auth: 'admin' },
  { path: '/admin/users', load: () => import('./pages/dashboard/adminUsers.js'), auth: 'admin' },
  { path: '/404', load: () => import('./pages/notFound.js') },
];

defineRoutes(ROUTES);

const headerEl = qs('#app-header');
const mainEl = qs('#app-main');
const footerEl = qs('#app-footer');

async function dispatch({ path, query, matched }){
  if (!matched){
    renderHeader(headerEl, resolveActiveNav(path));
    footerEl.hidden = false;
    const notFound = await import('./pages/notFound.js');
    notFound.mount(mainEl, { params: {}, query });
    renderFooter(footerEl);
    window.scrollTo(0, 0);
    return;
  }

  const { route, params } = matched;
  const isAppArea = !!route.auth; // dashboard/admin/account routes get their own shell, not the public site nav

  if (route.auth === 'client' && !isLoggedIn()){
    showToast('Please log in to view that page.', 'error');
    navigate('#/login');
    return;
  }
  if (route.auth === 'admin' && !isAdmin()){
    showToast('That page is for administrators only.', 'error');
    navigate('#/login');
    return;
  }

  if (isAppArea){
    renderAppBar(headerEl);
    footerEl.hidden = true;
    footerEl.innerHTML = '';
  } else {
    renderHeader(headerEl, resolveActiveNav(path));
    footerEl.hidden = false;
  }

  // Only show a loading placeholder if the page genuinely takes a moment - on fast
  // transitions (cached module + cached data) this avoids a visible flash on every click.
  const loadingTimer = setTimeout(() => {
    mainEl.innerHTML = '<div class="section-tight container"><p class="muted">Loading…</p></div>';
  }, 200);

  const mod = await route.load();
  await mod.mount(mainEl, { params, query });
  clearTimeout(loadingTimer);
  if (!isAppArea) renderFooter(footerEl);
  window.scrollTo(0, 0);
}

function resolveActiveNav(path){
  if (path.startsWith('/destinations')) return '#/destinations';
  if (path.startsWith('/packages') || path === '/build') return '#/packages';
  if (path.startsWith('/stories')) return '#/stories';
  return `#${path === '/' ? '/' : path}`;
}

onRouteChange(dispatch);
startRouter();
