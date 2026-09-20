import { render, qs, qsa, formatMoney, formatDate, showToast } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { dataTable, statusBadge } from '../../components/admin/table.js';
import { getBookings, setBookingStatus } from '../../services/dataLoader.js';

export async function mount(container){
  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Admin</span>
            <h2 style="margin-bottom:0">Bookings</h2>
          </div>
        </div>
        <div class="panel" id="bookings-panel"></div>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { active: '#/admin/bookings' });
  await refresh(container);
}

// The SPA keep-alive cache only re-runs mount() once ever per route; this page's data
// (booking statuses) changes from actions taken elsewhere, so it needs to refetch on
// every revisit, not just the first.
export async function activate(container){
  await refresh(container);
}

async function refresh(container){
  const bookings = await getBookings();
  const panel = qs('#bookings-panel', container);
  panel.innerHTML = `
    <div class="panel-head"><h4>All booking requests (${bookings.length})</h4></div>
    ${dataTable({
      columns: ['Trip', 'Traveller', 'Phone', 'Date', 'Children', 'Total', 'Status', 'Actions'],
      rows: bookings.map((b) => [
        b.title,
        b.name,
        b.phone,
        formatDate(b.date),
        b.children
          ? `<span title="${(b.childrenDetails || []).map((c) => `${c.name} (age ${c.age})`).join(', ')}">${b.children} \u2014 ${(b.childrenDetails || []).map((c) => `${c.name} (${c.age})`).join(', ') || 'details pending'}</span>`
          : '\u2014',
        formatMoney(b.totalKes),
        statusBadge(b.status),
        `<div class="row-actions">
          <button data-confirm="${b.id}" ${b.status === 'confirmed' ? 'disabled' : ''}>Confirm</button>
          <button data-cancel="${b.id}" ${b.status === 'cancelled' ? 'disabled' : ''}>Cancel</button>
        </div>`,
      ]),
      emptyMessage: 'No booking requests yet.',
    })}
  `;

  qsa('[data-confirm]', panel).forEach((btn) => btn.addEventListener('click', async () => {
    await setBookingStatus(btn.dataset.confirm, 'confirmed');
    showToast('Booking confirmed.', 'success');
    refresh(container);
  }));
  qsa('[data-cancel]', panel).forEach((btn) => btn.addEventListener('click', async () => {
    await setBookingStatus(btn.dataset.cancel, 'cancelled');
    showToast('Booking cancelled.', 'default');
    refresh(container);
  }));
}
