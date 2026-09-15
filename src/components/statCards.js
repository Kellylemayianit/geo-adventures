export function statCards(items){
  return `<div class="stat-cards">${items.map(s=>`
    <div class="stat-card panel">
      <div class="num">${s.num}</div>
      <div class="lbl">${s.lbl}</div>
      ${s.delta?`<div class="delta">${s.delta}</div>`:''}
    </div>`).join('')}</div>`;
}
