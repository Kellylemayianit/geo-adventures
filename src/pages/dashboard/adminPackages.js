import { render, qs, formatMoney, showToast } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { dataTable } from '../../components/admin/table.js';
import { actionMenu, wireActionMenus } from '../../components/admin/actionMenu.js';
import { getPackages } from '../../services/dataLoader.js';

export async function mount(container){
  const packages = await getPackages();

  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Admin</span>
            <h2 style="margin-bottom:0">Packages</h2>
          </div>
          <button class="btn btn-amber" id="add-package">+ Add Package</button>
        </div>
        <div class="panel">
          <div class="panel-head"><h4>Live safari packages (${packages.length})</h4></div>
          ${dataTable({
            columns: ['Package', 'Class', 'Days', 'Price / person', 'Actions'],
            rows: packages.map((p) => [
              p.title, p.classLabel, String(p.days), formatMoney(p.pricePerPersonKes),
              actionMenu(p.id, [{ action: 'edit', label: 'Edit' }, { action: 'remove', label: 'Remove', danger: true }]),
            ]),
          })}
        </div>
        <p class="muted" style="font-size:.85rem">Catalogue editing here is a preview — once the site is connected to a live backend, changes made here will save for real.</p>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { active: '#/admin/packages' });

  const notice = () => showToast('Package editing will go live once the backend is connected.', 'default');
  qs('#add-package', container).addEventListener('click', notice);
  wireActionMenus(container, notice);
}
