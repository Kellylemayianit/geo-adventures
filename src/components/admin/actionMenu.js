import { icon } from '../../utilities/icons.js';
import { qs, qsa } from '../../utilities/helpers.js';

/**
 * @param {string} rowId
 * @param {Array<{action:string, label:string, danger?:boolean}>} actions
 */
export function actionMenu(rowId, actions){
  return `
    <div class="action-menu" data-row-id="${rowId}">
      <button type="button" class="action-menu-trigger" data-menu-trigger aria-haspopup="true" aria-expanded="false" aria-label="Row actions">
        ${icon('more')}
      </button>
      <div class="action-menu-list" role="menu" hidden>
        ${actions.map((a) => `
          <button type="button" role="menuitem" class="${a.danger ? 'is-danger' : ''}" data-menu-action="${a.action}" data-row-id="${rowId}">${a.label}</button>
        `).join('')}
      </div>
    </div>
  `;
}

let globalListenerAttached = false;

/**
 * Wires every action-menu inside `root`. Call this once after each render (including
 * re-renders after a refresh) - it's safe to call repeatedly since old menus are replaced.
 * @param {HTMLElement} root
 * @param {(action:string, rowId:string) => void} onAction
 */
export function wireActionMenus(root, onAction){
  const closeAll = () => {
    qsa('.action-menu', root).forEach((m) => {
      m.querySelector('[data-menu-trigger]')?.setAttribute('aria-expanded', 'false');
      m.querySelector('.action-menu-list')?.setAttribute('hidden', '');
    });
  };

  qsa('[data-menu-trigger]', root).forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = trigger.closest('.action-menu');
      const list = menu.querySelector('.action-menu-list');
      const willOpen = list.hasAttribute('hidden');
      closeAll();
      if (willOpen){
        list.removeAttribute('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  qsa('[data-menu-action]', root).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAll();
      onAction(btn.dataset.menuAction, btn.dataset.rowId);
    });
  });

  if (!globalListenerAttached){
    globalListenerAttached = true;
    document.addEventListener('click', () => {
      qsa('.action-menu-list:not([hidden])').forEach((list) => {
        list.setAttribute('hidden', '');
        list.closest('.action-menu')?.querySelector('[data-menu-trigger]')?.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape'){
        qsa('.action-menu-list:not([hidden])').forEach((list) => list.setAttribute('hidden', ''));
      }
    });
  }
}
