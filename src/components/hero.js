export function renderHero({ image, script, title, text, stats = [], primaryCta, secondaryCta }){
  return `
    <section class="hero" style="background-image:url('${image}')">
      <div class="container">
        <div class="hero-copy">
          ${script ? `<span class="script">${script}</span>` : ''}
          <h1>${title}</h1>
          <p>${text}</p>
          <div class="hero-actions">
            ${primaryCta ? `<a class="btn btn-amber btn-lg" href="${primaryCta.href}">${primaryCta.label}</a>` : ''}
            ${secondaryCta ? `<a class="btn btn-outline btn-lg" style="border-color:#fff;color:#fff" href="${secondaryCta.href}">${secondaryCta.label}</a>` : ''}
          </div>
          ${stats.length ? `
            <div class="hero-stats">
              ${stats.map((s) => `<div><strong>${s.value}</strong><span>${s.label}</span></div>`).join('')}
            </div>` : ''}
        </div>
      </div>
    </section>
  `;
}

export function renderPageBanner({ image, title, crumbs = [] }){
  return `
    <section class="page-banner" style="background-image:url('${image}')">
      <div class="container">
        <h1>${title}</h1>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          ${crumbs.map((c, i) => `${i > 0 ? '<span>/</span>' : ''}${c.href ? `<a href="${c.href}">${c.label}</a>` : `<span>${c.label}</span>`}`).join(' ')}
        </nav>
      </div>
    </section>
  `;
}
