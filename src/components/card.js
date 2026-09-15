import { icon } from '../utilities/icons.js';
import { formatMoney, formatDate } from '../utilities/helpers.js';

export function destinationCard(d){
  return `
    <article class="card">
      <a href="#/destinations/${d.slug}">
        <div class="card-media" style="background-image:url('${d.image}')">
          <span class="pill">${d.region}</span>
        </div>
      </a>
      <div class="card-body">
        <h5><a href="#/destinations/${d.slug}">${d.name}</a></h5>
        <div class="card-meta"><span>${d.tagline}</span></div>
        <p class="muted" style="font-size:.9rem">${d.bestFor}</p>
      </div>
      <div class="card-footer">
        <span class="muted" style="font-size:.85rem">From ${formatMoney(d.priceFromKes)}/day</span>
        <a class="btn btn-outline btn-sm" href="#/destinations/${d.slug}">Explore</a>
      </div>
    </article>
  `;
}

export function packageCard(p){
  return `
    <article class="card">
      <a href="#/packages/${p.slug}">
        <div class="card-media" style="background-image:url('${p.image}')">
          <span class="pill pill-amber">${p.classLabel}</span>
          <span class="price-tag">${formatMoney(p.pricePerPersonKes)}</span>
        </div>
      </a>
      <div class="card-body">
        <h5><a href="#/packages/${p.slug}">${p.title}</a></h5>
        <div class="card-meta">
          <span>${icon('clock')} ${p.days} day${p.days > 1 ? 's' : ''}</span>
          <span>${icon('map')} ${p.destinationIds.length} park${p.destinationIds.length > 1 ? 's' : ''}</span>
        </div>
        <p class="muted" style="font-size:.9rem">${p.summary}</p>
      </div>
      <div class="card-footer">
        <span class="muted" style="font-size:.85rem">per person</span>
        <a class="btn btn-primary btn-sm" href="#/packages/${p.slug}">View Package</a>
      </div>
    </article>
  `;
}

export function storyCard(s){
  return `
    <article class="card">
      <a href="#/stories/${s.slug}">
        <div class="card-media" style="background-image:url('${s.image}')"></div>
      </a>
      <div class="card-body">
        <div class="card-meta"><span>${icon('clock')} ${formatDate(s.date)}</span></div>
        <h5><a href="#/stories/${s.slug}">${s.title}</a></h5>
        <p class="muted" style="font-size:.9rem">${s.excerpt}</p>
        <a class="btn btn-ghost btn-sm" href="#/stories/${s.slug}">Read Story ${icon('arrow')}</a>
      </div>
    </article>
  `;
}

export function teamCard(t){
  return `
    <article class="card text-center">
      <div class="card-media" style="background-image:url('${t.image}');aspect-ratio:1/1"></div>
      <div class="card-body">
        <h5>${t.name}</h5>
        <div class="eyebrow" style="font-size:.8rem">${t.role}</div>
        <p class="muted" style="font-size:.88rem;margin-top:.6rem">${t.bio}</p>
      </div>
    </article>
  `;
}

export function testimonialCard(r){
  const stars = Array.from({ length: r.rating }).map(() => icon('star')).join('');
  return `
    <article class="card">
      <div class="card-body">
        <div style="color:var(--amber-600);margin-bottom:.6rem">${stars}</div>
        <p style="font-style:italic">&ldquo;${r.text}&rdquo;</p>
        <strong>${r.name}</strong>
      </div>
    </article>
  `;
}

export function statIconCard({ icon: name, value, label }){
  return `
    <div class="stat-icon-card">
      <div class="icon-wrap">${icon(name)}</div>
      <h3 style="margin-bottom:.2rem">${value}</h3>
      <p class="muted" style="margin:0">${label}</p>
    </div>
  `;
}
