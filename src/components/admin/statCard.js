export function statCard({ label, value, delta }){
  return `
    <div class="stat-card">
      <span class="label">${label}</span>
      <strong>${value}</strong>
      ${delta ? `<span class="delta ${delta.direction}">${delta.direction === 'up' ? '▲' : '▼'} ${delta.text}</span>` : ''}
    </div>
  `;
}

export function statCardsRow(items){
  return `<div class="stat-cards">${items.map(statCard).join('')}</div>`;
}
