// DOM query/inject helpers + formatting + toast/modal mounting.
// These are the only two functions pages/components should use to touch the DOM directly.

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Replace the innerHTML of a mount point with a template string. */
export function render(target, html){
  const el = typeof target === 'string' ? qs(target) : target;
  if (!el) return null;
  el.innerHTML = html;
  return el;
}

export function el(tag, attrs = {}, html = ''){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  if (html) node.innerHTML = html;
  return node;
}

let currency = localStorage.getItem('gak_currency') || 'KES';
const FX_KES_PER_USD = 129;

export function getCurrency(){ return currency; }
export function setCurrency(next){
  currency = next;
  localStorage.setItem('gak_currency', next);
}

/** amountKes is always the canonical stored value. */
export function formatMoney(amountKes){
  if (currency === 'USD'){
    const usd = amountKes / FX_KES_PER_USD;
    return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `KES ${Number(amountKes).toLocaleString('en-KE')}`;
}

export function formatDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function slugify(str){
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ---------------- Toast ---------------- */
function toastStack(){
  let stack = qs('#toast-stack');
  if (!stack){
    stack = el('div', { id: 'toast-stack', class: 'toast-stack', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(stack);
  }
  return stack;
}

export function showToast(message, type = 'default', duration = 3200){
  const stack = toastStack();
  const node = el('div', { class: `toast ${type !== 'default' ? 'toast-' + type : ''}` }, message);
  stack.appendChild(node);
  setTimeout(() => node.remove(), duration);
}

/* ---------------- Modal ---------------- */
let modalRoot = null;

export function openModal(html, { onClose } = {}){
  closeModal();
  modalRoot = el('div', { class: 'modal-overlay' }, `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close" data-modal-close>&times;</button>
      ${html}
    </div>
  `);
  document.body.appendChild(modalRoot);
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot || e.target.closest('[data-modal-close]')) closeModal();
  });
  document.addEventListener('keydown', escHandler);
  if (onClose) modalRoot._onClose = onClose;
  return modalRoot;
}

function escHandler(e){
  if (e.key === 'Escape') closeModal();
}

export function closeModal(){
  if (modalRoot){
    if (modalRoot._onClose) modalRoot._onClose();
    modalRoot.remove();
    modalRoot = null;
  }
  document.removeEventListener('keydown', escHandler);
}

export function modalRootEl(){
  return modalRoot;
}
