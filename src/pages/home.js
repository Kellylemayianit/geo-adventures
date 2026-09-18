import { render } from '../utilities/helpers.js';
import { icon } from '../utilities/icons.js';
import { renderHero } from '../components/hero.js';
import { destinationCard, packageCard, storyCard, testimonialCard, statIconCard } from '../components/card.js';
import { getDestinations, getPackages, getTestimonials, getStories } from '../services/dataLoader.js';

export async function mount(container){
  const [destinations, packages, testimonials, stories] = await Promise.all([
    getDestinations(), getPackages(), getTestimonials(), getStories(),
  ]);

  const hero = renderHero({
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elephants_at_Amboseli_national_park_against_Mount_Kilimanjaro.jpg',
    script: 'Karibu Kimana',
    title: 'Safaris built from the ground up, right here in Kimana',
    text: 'Parks, stays and transport across Amboseli, the Maasai Mara, Tsavo and the wider Rift Valley — take one of our packages, or pick the pieces yourself.',
    primaryCta: { href: '#/build', label: 'Build Your Own Safari' },
    secondaryCta: { href: '#/packages', label: 'View Packages' },
    stats: [
      { value: `${destinations.length}+`, label: 'Parks Covered' },
      { value: '4', label: 'Transport Options' },
      { value: '3', label: 'Stay Tiers' },
    ],
  });

  render(container, `
    ${hero}

    <section class="section">
      <div class="container">
        <div class="text-center" style="max-width:640px;margin:0 auto 2.5rem">
          <span class="eyebrow">What we put together for you</span>
          <h2>Three building blocks, one safari</h2>
          <p class="muted">We are not just a booking agent — we operate the pieces ourselves and combine them for you, or let you combine them yourself.</p>
        </div>
        <div class="grid grid-3">
          ${statIconCard({ icon: 'map', value: 'Parks & Destinations', label: 'Amboseli, Maasai Mara, Tsavo East & West, Lake Nakuru and more.' })}
          ${statIconCard({ icon: 'bed', value: 'Stays for Every Budget', label: 'From simple budget camps to high-end luxury tented camps.' })}
          ${statIconCard({ icon: 'car', value: 'Transport Sorted', label: 'Saloon cars, 4x4 safari vehicles, motorbikes and tuktuks.' })}
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--paper-dim)">
      <div class="container">
        <div class="flex-between flex-wrap gap-md" style="margin-bottom:1.75rem">
          <div>
            <span class="eyebrow">Where we take you</span>
            <h2 style="margin-bottom:0">Featured destinations</h2>
          </div>
          <a class="btn btn-outline" href="#/destinations">All destinations ${icon('arrow')}</a>
        </div>
        <div class="grid grid-3">
          ${destinations.slice(0, 3).map(destinationCard).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="flex-between flex-wrap gap-md" style="margin-bottom:1.75rem">
          <div>
            <span class="eyebrow">Ready-made itineraries</span>
            <h2 style="margin-bottom:0">Popular safari packages</h2>
          </div>
          <a class="btn btn-outline" href="#/packages">All packages ${icon('arrow')}</a>
        </div>
        <div class="grid grid-3">
          ${packages.slice(0, 3).map(packageCard).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--green-700);color:#fff">
      <div class="container flex-between flex-wrap gap-md">
        <div style="max-width:560px">
          <span class="script" style="color:var(--amber-600)">Your safari, your rules</span>
          <h2 style="color:#fff">Don't see a package that fits? Build your own.</h2>
          <p style="color:rgba(255,255,255,.85)">Pick your park, your stay tier and your transport — we price it live and confirm over WhatsApp.</p>
        </div>
        <a class="btn btn-amber btn-lg" href="#/build">Start Building</a>
      </div>
    </section>

    <section class="section" style="background:var(--paper-dim)">
      <div class="container">
        <div class="text-center" style="max-width:600px;margin:0 auto 2.5rem">
          <span class="eyebrow">From our guests</span>
          <h2>What people say after travelling with us</h2>
        </div>
        <div class="grid grid-3">
          ${testimonials.map(testimonialCard).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="flex-between flex-wrap gap-md" style="margin-bottom:1.75rem">
          <div>
            <span class="eyebrow">Kenyan stories, told plainly</span>
            <h2 style="margin-bottom:0">From the Geo Adventures journal</h2>
          </div>
          <a class="btn btn-outline" href="#/stories">All stories ${icon('arrow')}</a>
        </div>
        <div class="grid grid-3">
          ${stories.map(storyCard).join('')}
        </div>
      </div>
    </section>
  `);
}
