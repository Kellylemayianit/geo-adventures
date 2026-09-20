import { render, qs, formatMoney, showToast } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { dataTable } from '../../components/admin/table.js';
import { actionMenu, wireActionMenus } from '../../components/admin/actionMenu.js';
import { getDestinations } from '../../services/dataLoader.js';

export async function mount(container){
  const destinations = await getDestinations();

  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Admin</span>
            <h2 style="margin-bottom:0">Destinations</h2>
          </div>
          <button class="btn btn-amber" id="add-dest">+ Add Destination</button>
        </div>
        <div class="panel">
          <div class="panel-head"><h4>Parks on the site (${destinations.length})</h4></div>
          ${dataTable({
            columns: ['Park', 'Region', 'From / day', 'Actions'],
            rows: destinations.map((d) => [
              d.name, d.region, formatMoney(d.priceFromKes),
              actionMenu(d.id, [{ action: 'edit', label: 'Edit' }, { action: 'remove', label: 'Remove', danger: true }]),
            ]),
          })}
        </div>
        <p class="muted" style="font-size:.85rem">Catalogue editing here is a preview — once the site is connected to a live backend, changes made here will save for real.</p>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { active: '#/admin/destinations' });

  const notice = () => showToast('Destination editing will go live once the backend is connected.', 'default');
  qs('#add-dest', container).addEventListener('click', notice);
  wireActionMenus(container, notice);
}
