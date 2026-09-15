import { render, qs, qsa, formatMoney } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { icon } from '../utilities/icons.js';
import { renderBookingPanel, wireBookingForm } from '../components/bookingForm.js';
import { computeCustomPrice } from '../utilities/booking.js';
import { getDestinations, getStayTiers, getTransportOptions } from '../services/dataLoader.js';

export async function mount(container, { query }){
  const [destinations, stayTiers, transportOptions] = await Promise.all([
    getDestinations(), getStayTiers(), getTransportOptions(),
  ]);

  const state = {
    destinationIds: query.destination ? [query.destination] : [destinations[0].id],
    stayTierId: 'midrange',
    transportId: '4x4',
    travelers: 2,
    days: 3,
  };

  render(container, `
    ${renderPageBanner({ image: 'assets/img/banner-build.svg', title: 'Build Your Own Safari', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Build Your Own' }] })}
    <section class="section">
      <div class="container builder">
        <div>
          <div class="builder-step">
            <h4><span class="step-no">1</span> Choose your park(s)</h4>
            <p class="muted">Pick one or combine a few for a longer circuit.</p>
            <div class="option-grid" id="step-destinations">
              ${destinations.map((d) => `
                <button type="button" class="option-card" data-id="${d.id}">
                  <strong>${d.name.replace(' National Park', '').replace(' National Reserve', '')}</strong>
                  <span>From ${formatMoney(d.priceFromKes)}/day</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="builder-step">
            <h4><span class="step-no">2</span> Choose your stay</h4>
            <div class="option-grid" id="step-stay">
              ${stayTiers.map((s) => `
                <button type="button" class="option-card" data-id="${s.id}">
                  <strong>${s.label}</strong>
                  <span>${formatMoney(s.pricePerNightKes)}/night</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="builder-step">
            <h4><span class="step-no">3</span> Choose your transport</h4>
            <div class="option-grid" id="step-transport">
              ${transportOptions.map((t) => `
                <button type="button" class="option-card" data-id="${t.id}">
                  <strong>${icon(t.icon)} ${t.label}</strong>
                  <span>${formatMoney(t.pricePerDayKes)}/day · seats ${t.capacity}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="builder-step">
            <h4><span class="step-no">4</span> Travellers &amp; days</h4>
            <div class="grid grid-2" style="margin-top:1rem;max-width:420px">
              <div class="field-group">
                <label class="field-label">Travellers</label>
                <span class="qty-stepper" id="qty-travelers">
                  <button type="button" data-step="-1">−</button><span>${state.travelers}</span><button type="button" data-step="1">+</button>
                </span>
              </div>
              <div class="field-group">
                <label class="field-label">Days</label>
                <span class="qty-stepper" id="qty-days">
                  <button type="button" data-step="-1">−</button><span>${state.days}</span><button type="button" data-step="1">+</button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div id="builder-panel-mount"></div>
      </div>
    </section>
  `);

  const panelMount = qs('#builder-panel-mount', container);

  function selectedDestinations(){ return destinations.filter((d) => state.destinationIds.includes(d.id)); }
  function selectedStay(){ return stayTiers.find((s) => s.id === state.stayTierId); }
  function selectedTransport(){ return transportOptions.find((t) => t.id === state.transportId); }

  function refreshPanel(){
    const pricing = computeCustomPrice({
      destinations: selectedDestinations(), stayTier: selectedStay(), transport: selectedTransport(),
      travelers: state.travelers, days: state.days,
    });
    panelMount.innerHTML = renderBookingPanel({
      title: 'Your custom safari',
      total: pricing.total,
      lines: [
        { label: 'Park fees & activities', value: formatMoney(pricing.parkFees) },
        { label: `Stay (${pricing.nights} night${pricing.nights === 1 ? '' : 's'})`, value: formatMoney(pricing.stayCost) },
        { label: `Transport (${pricing.vehiclesNeeded} vehicle${pricing.vehiclesNeeded === 1 ? '' : 's'})`, value: formatMoney(pricing.transportCost) },
      ],
      ctaLabel: 'Request This Custom Safari',
    });
    wireBookingForm(panelMount, () => ({
      type: 'custom',
      title: `Custom safari: ${selectedDestinations().map((d) => d.name).join(', ')}`,
      destinationIds: state.destinationIds,
      stayTier: state.stayTierId,
      transportId: state.transportId,
      travelers: state.travelers,
      days: state.days,
      totalKes: pricing.total,
    }));
  }

  function syncOptionCards(){
    qsa('#step-destinations .option-card', container).forEach((btn) => {
      btn.classList.toggle('is-selected', state.destinationIds.includes(btn.dataset.id));
    });
    qsa('#step-stay .option-card', container).forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.id === state.stayTierId);
    });
    qsa('#step-transport .option-card', container).forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.id === state.transportId);
    });
  }

  qs('#step-destinations', container).addEventListener('click', (e) => {
    const btn = e.target.closest('.option-card');
    if (!btn) return;
    const id = btn.dataset.id;
    if (state.destinationIds.includes(id)){
      if (state.destinationIds.length > 1) state.destinationIds = state.destinationIds.filter((x) => x !== id);
    } else {
      state.destinationIds.push(id);
    }
    syncOptionCards();
    refreshPanel();
  });

  qs('#step-stay', container).addEventListener('click', (e) => {
    const btn = e.target.closest('.option-card');
    if (!btn) return;
    state.stayTierId = btn.dataset.id;
    syncOptionCards();
    refreshPanel();
  });

  qs('#step-transport', container).addEventListener('click', (e) => {
    const btn = e.target.closest('.option-card');
    if (!btn) return;
    state.transportId = btn.dataset.id;
    syncOptionCards();
    refreshPanel();
  });

  qs('#qty-travelers', container).addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-step]');
    if (!btn) return;
    state.travelers = Math.max(1, state.travelers + Number(btn.dataset.step));
    qs('#qty-travelers span', container).textContent = state.travelers;
    refreshPanel();
  });

  qs('#qty-days', container).addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-step]');
    if (!btn) return;
    state.days = Math.max(1, state.days + Number(btn.dataset.step));
    qs('#qty-days span', container).textContent = state.days;
    refreshPanel();
  });

  syncOptionCards();
  refreshPanel();
}
