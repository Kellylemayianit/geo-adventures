import { render, qs, qsa } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { destinationCard } from '../components/card.js';
import { getDestinations } from '../services/dataLoader.js';

export async function mount(container){
  const destinations = await getDestinations();
  const regions = ['All', ...new Set(destinations.map((d) => d.region))];

  render(container, `
    ${renderPageBanner({ image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maasai_Mara_National_Reserve_Kenya.jpg', title: 'Parks & Destinations', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Destinations' }] })}
    <section class="section">
      <div class="container">
        <div class="filter-bar" style="margin-bottom:2rem" id="region-filter">
          ${regions.map((r, i) => `<button class="filter-chip" data-region="${r}" aria-pressed="${i === 0}">${r}</button>`).join('')}
        </div>
        <div class="grid grid-3" id="dest-grid">
          ${destinations.map(destinationCard).join('')}
        </div>
      </div>
    </section>
  `);

  qsa('#region-filter button', container).forEach((btn) => {
    btn.addEventListener('click', () => {
      qsa('#region-filter button', container).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const region = btn.dataset.region;
      const filtered = region === 'All' ? destinations : destinations.filter((d) => d.region === region);
      qs('#dest-grid', container).innerHTML = filtered.map(destinationCard).join('') || '<p class="muted">No destinations in this region yet.</p>';
    });
  });
}
