/* ==========================================================
   HELPERS — DOM query/inject helpers, formatting, toast.
   ========================================================== */
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export const fmtDate = (d) => new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
export const tierLabel = (t) => ({budget:'Budget',mid:'Mid-range',luxury:'Luxury'}[t]||t);
export const transportLabel = (t) => ({jeep:'4×4 Jeep',motorbike:'Motorbike'}[t]||t);

let toastTimer = null;
export function toast(msg, kind='ok'){
  const root = $('#toast-root'); if(!root) return;
  root.innerHTML = `<div class="toast panel-hi show" style="border-color:${kind==='ok'?'rgba(124,148,103,.4)':'rgba(193,89,79,.4)'}">
    <span style="font-size:15px">${kind==='ok'?'✓':'!'}</span>
    <span style="font-size:13px;color:var(--ink)">${msg}</span></div>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ const t=$('.toast'); if(t) t.classList.remove('show'); },3000);
}

/* -------- shared modal mount (used by admin package/accommodation editors) -------- */
export function openModal(innerHtml){
  const root = $('#modal-root'); if(!root) return;
  root.innerHTML = `<div class="modal-backdrop" data-modal-backdrop>${innerHtml}</div>`;
}
export function closeModal(){
  const root = $('#modal-root'); if(root) root.innerHTML = '';
}
