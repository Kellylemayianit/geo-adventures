import { render } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { teamCard } from '../components/card.js';
import { getTeam } from '../services/dataLoader.js';

export async function mount(container){
  const team = await getTeam();

  render(container, `
    ${renderPageBanner({ image: 'assets/img/banner-about.svg', title: 'About Geo Adventures Kenya', crumbs: [{ label: 'Home', href: '#/' }, { label: 'About' }] })}

    <section class="section">
      <div class="container grid grid-2" style="align-items:center">
        <div>
          <span class="eyebrow">Based in Kimana</span>
          <h2>We didn't start in an office in Nairobi — we started here, at the Amboseli gate</h2>
          <p>Geo Adventures Kenya is run out of Kimana, a few minutes from the Amboseli entrance and a comfortable drive from Tsavo, the Maasai Mara and the Rift Valley lakes. That location shapes everything we do: we know the roads, the seasons, the lodge owners and the rangers personally, because we live among them.</p>
          <p>What began as arranging trips for friends and returning guests grew into three connected services — access to the parks, connections with hotels from budget to luxury, and our own transport fleet of cars, 4x4s, motorbikes and tuktuks. Put together, that's a safari package. Taken apart, that's a set of tools you can combine your own way.</p>
        </div>
        <div>
          <img src="assets/img/about-team.svg" alt="Geo Adventures Kenya team in Kimana" style="border-radius:var(--radius-lg)">
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--paper-dim)">
      <div class="container grid grid-3">
        <div class="stat-icon-card">
          <h3>Our promise</h3>
          <p class="muted">No surprise costs. Every quote you get, fixed or custom, is confirmed with you over WhatsApp before you pay anything.</p>
        </div>
        <div class="stat-icon-card">
          <h3>Local knowledge</h3>
          <p class="muted">Every guide and driver on our team grew up around these parks — not flown in for the season.</p>
        </div>
        <div class="stat-icon-card">
          <h3>Flexible by design</h3>
          <p class="muted">Fixed packages when you want it simple, a build-your-own tool when you want control.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="text-center" style="max-width:600px;margin:0 auto 2.5rem">
          <span class="eyebrow">The people behind the trips</span>
          <h2>Meet the team</h2>
        </div>
        <div class="grid grid-4">
          ${team.map(teamCard).join('')}
        </div>
      </div>
    </section>
  `);
}
