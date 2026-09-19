import { render, qs, formatMoney } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { icon } from '../utilities/icons.js';
import { renderBookingPanel, wireBookingForm } from '../components/bookingForm.js';
import { computePackagePrice } from '../utilities/booking.js';
import { getPackage, getDestinations, getStayTiers, getTransportOptions } from '../services/dataLoader.js';

export async function mount(container, { params }){
  const pkg = await getPackage(params.slug);
  if (!pkg){
    render(container, `<div class="section container text-center"><h2>Package not found</h2><a class="btn btn-primary" href="#/packages">Back to packages</a></div>`);
    return;
  }
  const [allDest, allStays, allTransport] = await Promise.all([getDestinations(), getStayTiers(), getTransportOptions()]);
  const destNames = pkg.destinationIds.map((id) => allDest.find((d) => d.id === id)?.name).filter(Boolean);
  const stay = allStays.find((s) => s.id === pkg.stayTier);
  const transport = allTransport.find((t) => t.id === pkg.transportId);

  let travelers = 2;
  let children = 0;

  function panelHtml(){
    const total = computePackagePrice(pkg, travelers);
    return renderBookingPanel({
      title: pkg.title,
      total,
      lines: [
        { label: 'Price per person', value: formatMoney(pkg.pricePerPersonKes) },
        { label: 'Travellers', value: `<span id="pd-qty-display">${travelers}</span>` },
      ],
      ctaLabel: 'Request to Book This Package',
      childrenCount: children,
    });
  }

  function stepperRow(){
    return `
      <div class="grid grid-2" style="margin-top:1rem;padding:0 1.75rem">
        <div>
          <span class="field-label" style="margin:0 0 .3rem;display:block">Travellers</span>
          <span class="qty-stepper" id="pd-qty">
            <button type="button" data-step="-1" aria-label="Decrease travellers">−</button>
            <span>${travelers}</span>
            <button type="button" data-step="1" aria-label="Increase travellers">+</button>
          </span>
        </div>
        <div>
          <span class="field-label" style="margin:0 0 .3rem;display:block">Of which, children</span>
          <span class="qty-stepper" id="pd-qty-children">
            <button type="button" data-step="-1" aria-label="Decrease children">−</button>
            <span>${children}</span>
            <button type="button" data-step="1" aria-label="Increase children">+</button>
          </span>
        </div>
      </div>
    `;
  }

  render(container, `
    ${renderPageBanner({ image: pkg.image, title: pkg.title, crumbs: [{ label: 'Home', href: '#/' }, { label: 'Packages', href: '#/packages' }, { label: pkg.title }] })}
    <section class="section">
      <div class="container builder">
        <div>
          <div class="flex gap-sm" style="margin-bottom:1rem">
            <span class="pill pill-amber">${pkg.classLabel}</span>
            <span class="pill">${icon('clock')} ${pkg.days} day${pkg.days > 1 ? 's' : ''}</span>
            <span class="pill">${icon('bed')} ${stay?.label || ''}</span>
            <span class="pill">${icon('car')} ${transport?.label || ''}</span>
          </div>
          <h2>Overview</h2>
          <p>${pkg.summary}</p>
          <p class="muted">Covers: ${destNames.join(', ')}</p>

          <h3>What's included</h3>
          <div class="grid grid-2" style="margin-bottom:2rem">
            ${pkg.highlights.map((h) => `<div class="flex gap-sm"><span style="color:var(--green-600)">${icon('check')}</span><span>${h}</span></div>`).join('')}
          </div>

          <h3>Day-by-day itinerary</h3>
          <div>
            ${pkg.itinerary.map((it) => `
              <div class="builder-step">
                <h4><span class="step-no">${it.day}</span> ${it.title}</h4>
                <p class="muted" style="margin-top:.6rem">${it.text}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="booking-panel-mount">
          ${panelHtml()}
          ${stepperRow()}
        </div>
      </div>
    </section>
  `);

  const mount_ = qs('#booking-panel-mount', container);

  function refreshPanel(){
    mount_.innerHTML = panelHtml() + stepperRow();
    wireStepper();
    wireBookingForm(mount_, () => ({
      type: 'package',
      packageId: pkg.id,
      title: pkg.title,
      travelers,
      totalKes: computePackagePrice(pkg, travelers),
    }), children);
  }

  function wireStepper(){
    qs('#pd-qty', mount_)?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-step]');
      if (!btn) return;
      travelers = Math.max(1, travelers + Number(btn.dataset.step));
      if (children > travelers) children = travelers;
      refreshPanel();
    });
    qs('#pd-qty-children', mount_)?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-step]');
      if (!btn) return;
      children = Math.min(travelers, Math.max(0, children + Number(btn.dataset.step)));
      refreshPanel();
    });
  }

  wireStepper();
  wireBookingForm(mount_, () => ({
    type: 'package',
    packageId: pkg.id,
    title: pkg.title,
    travelers,
    totalKes: computePackagePrice(pkg, travelers),
  }), children);
}
