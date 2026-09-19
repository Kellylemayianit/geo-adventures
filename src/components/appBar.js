import { icon } from '../utilities/icons.js';
import { currentUser, signOut } from '../utilities/auth.js';
import { qs } from '../utilities/helpers.js';
import { resolvedTheme, toggleTheme } from '../utilities/theme.js';

export function renderAppBar(root){
  const user = currentUser();
  root.innerHTML = `
    <header class="app-bar">
      <div class="app-bar-inner">
        <a class="brand" href="${(user?.role === 'admin' || user?.role === 'moderator') ? '#/admin' : '#/dashboard'}" style="font-size:1.1rem">
          <span class="brand-mark">Geo</span> Adventures <span class="brand-sub">${user?.role === 'admin' ? 'Admin' : user?.role === 'moderator' ? 'Staff' : 'Account'}</span>
        </a>
        <div class="app-bar-actions">
          <button class="icon-btn" id="app-bar-theme-toggle" title="Toggle dark mode" aria-label="Toggle dark mode">${icon(resolvedTheme() === 'dark' ? 'sun' : 'moon')}</button>
          <a class="btn btn-ghost btn-sm" href="#/">${icon('arrow')} View Storefront</a>
          <button class="icon-btn" id="app-bar-logout" title="Log out" aria-label="Log out">${icon('logout')}</button>
        </div>
      </div>
    </header>
  `;
  qs('#app-bar-logout', root)?.addEventListener('click', () => {
    signOut();
    window.location.hash = '#/';
  });
  qs('#app-bar-theme-toggle', root)?.addEventListener('click', (e) => {
    const next = toggleTheme();
    e.currentTarget.innerHTML = icon(next === 'dark' ? 'sun' : 'moon');
  });
}
