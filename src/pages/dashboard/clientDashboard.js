import { render, qs, formatMoney, formatDate } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { dataTable, statusBadge } from '../../components/admin/table.js';
import { currentUser } from '../../utilities/auth.js';
import { getBookings } from '../../services/dataLoader.js';

export async function mount(container){
  const user = currentUser();
  const bookings = await getBookings((b) => b.userId === user.id || b.phone === user.phone);

  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Karibu, ${user.name.split(' ')[0]}</span>
            <h2 style="margin-bottom:0">My bookings</h2>
          </div>
          <a class="btn btn-amber" href="#/build">Build a new safari</a>
        </div>
        <div class="panel">
          <div class="panel-head"><h4>Booking history</h4></div>
          ${dataTable({
            columns: ['Trip', 'Type', 'Date', 'Travellers', 'Total', 'Status'],
            rows: bookings.map((b) => [
              b.title,
              b.type === 'package' ? 'Package' : 'Custom',
              formatDate(b.date),
              String(b.travelers || 1),
              formatMoney(b.totalKes),
              statusBadge(b.status),
            ]),
            emptyMessage: 'No bookings yet — build a safari to get started.',
          })}
        </div>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { role: 'client', active: '#/dashboard' });
}
