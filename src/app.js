import { defineRoutes, onRouteChange, startRouter, navigate } from './router.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderAppBar } from './components/appBar.js';
import { qs, showToast } from './utilities/helpers.js';
import { isLoggedIn, isAdmin, isStaff, onAuthChange } from './utilities/auth.js';
import { clearViewCache, ensureView, hideLoading, peekView, showLoading } from './runtime/spa.js';

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
  { path: '/admin', load: () => import('./pages/dashboard/adminDashboard.js'), auth: 'staff' },
  { path: '/admin/bookings', load: () => import('./pages/dashboard/adminBookings.js'), auth: 'staff' },
  { path: '/admin/packages', load: () => import('./pages/dashboard/adminPackages.js'), auth: 'staff' },
  { path: '/admin/destinations', load: () => import('./pages/dashboard/adminDestinations.js'), auth: 'staff' },
  { path: '/admin/users', load: () => import('./pages/dashboard/adminUsers.js'), auth: 'staff' },
  { path: '/404', load: () => import('./pages/notFound.js') },
];

defineRoutes(ROUTES);

const headerEl = qs('#app-header');
const mainEl = qs('#app-main');
const footerEl = qs('#app-footer');

let navToken = 0;

onAuthChange(() => clearViewCache());

async function dispatch({ path, query, matched }){
  const myToken = ++navToken;
  const stillCurrent = () => myToken === navToken;
  const viewKey = viewKeyFor(path, query);

  if (!matched){
    applyPublicShell(path);
    try {
      await ensureView({
        key: '/404',
        mainEl,
        load: () => import('./pages/notFound.js'),
        mountArgs: { params: {}, query },
        stillCurrent,
      });
    } catch (e){
      if (stillCurrent()) paintError(e, { path, query, matched });
    }
    window.scrollTo(0, 0);
    return;
  }

  const { route, params } = matched;
  const isAppArea = !!route.auth;

  if (route.auth === 'client' && !isLoggedIn()){
    showToast('Please log in to view that page.', 'error');
    navigate('#/login');
    return;
  }
  if (route.auth === 'staff' && !isStaff()){
    showToast('That page is for staff only.', 'error');
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
    applyPublicShell(path);
  }

  const loadingTimer = setTimeout(() => {
    if (stillCurrent() && !peekView(viewKey)) showLoading(mainEl);
  }, 120);

  try {
    await ensureView({
      key: viewKey,
      mainEl,
      load: route.load,
      mountArgs: { params, query },
      stillCurrent,
    });
    if (!stillCurrent()) return;
    if (!isAppArea) renderFooter(footerEl);
    window.scrollTo(0, 0);
  } catch (e){
    if (!stillCurrent()) return;
    paintError(e, { path, query, matched });
    if (!isAppArea) renderFooter(footerEl);
  } finally {
    clearTimeout(loadingTimer);
    if (stillCurrent()) hideLoading(mainEl);
  }
}

function applyPublicShell(path){
  renderHeader(headerEl, resolveActiveNav(path));
  footerEl.hidden = false;
}

function viewKeyFor(path, query){
  const keys = Object.keys(query || {});
  if (!keys.length) return path;
  const qsStr = keys.sort().map((k) => `${k}=${query[k]}`).join('&');
  return `${path}?${qsStr}`;
}

function paintError(e, nav){
  console.error('Page failed to load:', e);
  hideLoading(mainEl);
  let host = mainEl.querySelector('.nav-error');
  if (!host){
    host = document.createElement('div');
    host.className = 'nav-error page-host';
    mainEl.appendChild(host);
  }
  for (const child of mainEl.children){
    if (child.classList.contains('page-host') && child !== host) child.hidden = true;
  }
  host.hidden = false;
  host.innerHTML = `
    <div class="section-tight container text-center">
      <h3>Something went wrong loading this page</h3>
      <p class="muted">${e?.message || 'Please try again, or head back home.'}</p>
      <div class="flex gap-sm flex-center" style="margin-top:1rem">
        <button class="btn btn-primary" id="retry-nav">Retry</button>
        <a class="btn btn-outline" href="#/">Go Home</a>
      </div>
    </div>
  `;
  qs('#retry-nav', host)?.addEventListener('click', () => dispatch(nav));
}

function resolveActiveNav(path){
  if (path.startsWith('/destinations')) return '#/destinations';
  if (path.startsWith('/packages') || path === '/build') return '#/packages';
  if (path.startsWith('/stories')) return '#/stories';
  return `#${path === '/' ? '/' : path}`;
}

function prefetchRoutes(){
  const run = () => ROUTES.forEach((r) => r.load().catch(() => {}));
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1800 });
  else setTimeout(run, 400);
}

onRouteChange(dispatch);
startRouter();
prefetchRoutes();
