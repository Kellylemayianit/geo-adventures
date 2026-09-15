/**
 * @param {Object} opts
 * @param {string[]} opts.columns          column headers
 * @param {Array<Array<string>>} opts.rows  each row is an array of pre-rendered HTML strings, same length as columns
 * @param {string} [opts.emptyMessage]
 */
export function dataTable({ columns, rows, emptyMessage = 'No records yet.' }){
  if (!rows.length){
    return `<p class="muted" style="padding:1.5rem 0">${emptyMessage}</p>`;
  }
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function statusBadge(status){
  return `<span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}
