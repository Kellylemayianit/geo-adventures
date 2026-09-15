import { render, qs, qsa } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { packageCard } from '../components/card.js';
import { getPackages } from '../services/dataLoader.js';

export async function mount(container){
  const packages = await getPackages();
  const classes = ['All', ...new Set(packages.map((p) => p.classLabel))];

  render(container, `
    ${renderPageBanner({ image: 'assets/img/banner-packages.svg', title: 'Safari Packages', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Packages' }] })}
    <section class="section">
      <div class="container">
        <div class="flex-between flex-wrap gap-md" style="margin-bottom:1.5rem">
          <div class="filter-bar" id="class-filter">
            ${classes.map((c, i) => `<button class="filter-chip" data-class="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}
          </div>
          <a class="btn btn-amber" href="#/build">Prefer to build your own? ${'\u2192'}</a>
        </div>
        <div class="grid grid-3" id="pkg-grid">
          ${packages.map(packageCard).join('')}
        </div>
      </div>
    </section>
  `);

  qsa('#class-filter button', container).forEach((btn) => {
    btn.addEventListener('click', () => {
      qsa('#class-filter button', container).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const cls = btn.dataset.class;
      const filtered = cls === 'All' ? packages : packages.filter((p) => p.classLabel === cls);
      qs('#pkg-grid', container).innerHTML = filtered.map(packageCard).join('') || '<p class="muted">No packages in this class right now.</p>';
    });
  });
}
