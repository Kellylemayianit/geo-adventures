import { render, qs, formatMoney, formatDate } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { statCardsRow } from '../../components/admin/statCard.js';
import { dataTable, statusBadge } from '../../components/admin/table.js';
import { getBookings, getPackages, getDestinations } from '../../services/dataLoader.js';

export async function mount(container){
  const [bookings, packages, destinations] = await Promise.all([getBookings(), getPackages(), getDestinations()]);
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalKes || 0), 0);
  const recent = bookings.slice(0, 6);

  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Admin</span>
            <h2 style="margin-bottom:0">Overview</h2>
          </div>
        </div>
        ${statCardsRow([
          { label: 'Total Bookings', value: bookings.length },
          { label: 'Pending Requests', value: pending },
          { label: 'Est. Booked Revenue', value: formatMoney(revenue) },
          { label: 'Live Packages', value: packages.length },
        ])}
        <div class="panel">
          <div class="panel-head">
            <h4>Recent booking requests</h4>
            <a class="btn btn-outline btn-sm" href="#/admin/bookings">View all</a>
          </div>
          ${dataTable({
            columns: ['Trip', 'Traveller', 'Phone', 'Total', 'Status'],
            rows: recent.map((b) => [b.title, b.name, b.phone, formatMoney(b.totalKes), statusBadge(b.status)]),
            emptyMessage: 'No booking requests yet.',
          })}
        </div>
        <div class="panel">
          <div class="panel-head"><h4>Destinations on the site</h4></div>
          ${dataTable({
            columns: ['Park', 'Region', 'From (per day)'],
            rows: destinations.map((d) => [d.name, d.region, formatMoney(d.priceFromKes)]),
          })}
        </div>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { role: 'admin', active: '#/admin' });
}
