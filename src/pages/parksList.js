import { parks } from '../services/dataLoader.js';

export function pageParksList(){
  return `
  <section class="section wrap">
    <div class="eyebrow">Field guide</div>
    <h1 class="h2" style="margin-top:8px;">National parks &amp; reserves</h1>
    <p style="margin-top:8px; max-width:560px;">Every itinerary — pre-built or custom — draws from these four landscapes.</p>
    <div class="grid grid-2" style="margin-top:28px;">
      ${parks().map(p=>`
      <div class="card panel" data-nav="park-detail" data-id="${p.id}" style="cursor:pointer; flex-direction:row;">
        <div class="card-img" style="width:180px; height:auto; flex-shrink:0; background-image:url('${p.img}')"></div>
        <div class="card-body">
          <div class="card-title">${p.name}</div>
          <div class="coord">${p.coord}</div>
          <p style="font-size:13px; margin-top:4px;">${p.description.slice(0,100)}…</p>
        </div>
      </div>`).join('')}
    </div>
  </section>`;
}
