import { getCurrentUser, isAdmin } from '../utilities/auth.js';
import { getCurrency, listCurrencies } from '../services/dataLoader.js';

export function headerNav(route){
  const links = [['home','Home'],['parks','Parks'],['packages','Packages'],['accommodations','Stays'],['booking','Book']];
  const currentUser = getCurrentUser();
  const currencies = listCurrencies();
  const activeCurrency = getCurrency();

  return `
  <header class="site">
    <div class="wrap header-inner">
      <a class="brand" data-nav="home"><span class="mark">GA</span> Geo Adventures</a>
      <nav class="main">
        ${links.map(([r,l])=>`<a href="#" data-nav="${r}" class="${route===r?'active':''}">${l}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <label class="currency-switch">
          <select data-currency-select aria-label="Currency">
            ${Object.values(currencies).map(c=>`<option value="${c.code}" ${c.code===activeCurrency?'selected':''}>${c.code}</option>`).join('')}
          </select>
        </label>
        ${currentUser ? `
          <span class="badge-role">${currentUser.role}</span>
          <button class="btn btn-ghost btn-sm" data-nav="${isAdmin()?'admin':'my-bookings'}">${isAdmin()?'Dashboard':'My bookings'}</button>
          <button class="btn btn-outline btn-sm" data-action="logout">Log out</button>
        ` : `
          <button class="btn btn-outline btn-sm" data-nav="login">Log in</button>
        `}
      </div>
    </div>
  </header>`;
}
