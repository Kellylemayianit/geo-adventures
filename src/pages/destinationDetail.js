import { render, formatMoney } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { icon } from '../utilities/icons.js';
import { packageCard } from '../components/card.js';
import { getDestination, getPackages } from '../services/dataLoader.js';

export async function mount(container, { params }){
  const dest = await getDestination(params.slug);
  if (!dest){
    render(container, `<div class="section container text-center"><h2>Destination not found</h2><a class="btn btn-primary" href="#/destinations">Back to destinations</a></div>`);
    return;
  }
  const packages = (await getPackages()).filter((p) => p.destinationIds.includes(dest.id));

  render(container, `
    ${renderPageBanner({ image: dest.image, title: dest.name, crumbs: [{ label: 'Home', href: '#/' }, { label: 'Destinations', href: '#/destinations' }, { label: dest.name }] })}
    <section class="section">
      <div class="container grid grid-2" style="align-items:start">
        <div>
          <span class="eyebrow">${dest.region}</span>
          <h2>${dest.tagline}</h2>
          <p>${dest.description}</p>
          <h4>What you can do here</h4>
          <div class="flex flex-wrap gap-sm" style="margin-bottom:1.5rem">
            ${dest.activities.map((a) => `<span class="pill">${icon('check')} ${a}</span>`).join('')}
          </div>
          <a class="btn btn-amber" href="#/build?destination=${dest.id}">Build a safari to ${dest.name.split(' ')[0]}</a>
        </div>
        <aside class="booking-panel">
          <h4>Quick facts</h4>
          <div class="booking-line"><span>Best for</span><span>${dest.bestFor}</span></div>
          <div class="booking-line"><span>Region</span><span>${dest.region}</span></div>
          <div class="booking-line total"><span>From</span><span>${formatMoney(dest.priceFromKes)}/day per person</span></div>
        </aside>
      </div>
    </section>

    ${packages.length ? `
    <section class="section" style="background:var(--paper-dim)">
      <div class="container">
        <h3>Packages that include ${dest.name}</h3>
        <div class="grid grid-3">${packages.map(packageCard).join('')}</div>
      </div>
    </section>` : ''}
  `);
}
