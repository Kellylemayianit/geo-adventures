import { render } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { teamCard } from '../components/card.js';
import { getTeam } from '../services/dataLoader.js';

export async function mount(container){
  const team = await getTeam();
  render(container, `
    ${renderPageBanner({ image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Morning_Samburu_National_Reserve_landscape_with_safari_vehicle,_Kenya.jpg', title: 'Our Team', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Team' }] })}
    <section class="section">
      <div class="container">
        <div class="text-center" style="max-width:600px;margin:0 auto 2.5rem">
          <span class="eyebrow">The people on the ground</span>
          <h2>Guides and coordinators from around Kimana</h2>
          <p class="muted">Every trip you book is planned and driven by people who actually live in the south.</p>
        </div>
        <div class="grid grid-4">
          ${team.map(teamCard).join('')}
        </div>
      </div>
    </section>
  `);
}
