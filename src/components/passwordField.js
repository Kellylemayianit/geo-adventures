import { icon } from '../utilities/icons.js';
import { qsa } from '../utilities/helpers.js';

/**
 * Renders a password input wrapped with a show/hide toggle button.
 * @param {Object} opts
 * @param {string} opts.id
 * @param {string} opts.name
 * @param {string} opts.label
 * @param {string} [opts.placeholder]
 * @param {string} [opts.value]
 * @param {boolean} [opts.required]
 * @param {number} [opts.minlength]
 */
export function passwordField({ id, name, label, placeholder = '', value = '', required = true, minlength }){
  return `
    <div class="field-group">
      <label class="field-label" for="${id}">${label}</label>
      <div class="password-field">
        <input class="text-field" id="${id}" name="${name}" type="password" placeholder="${placeholder}"
          value="${value}" ${required ? 'required' : ''} ${minlength ? `minlength="${minlength}"` : ''} autocomplete="off">
        <button type="button" class="password-toggle" data-password-toggle="${id}" aria-label="Show password" aria-pressed="false">
          ${icon('eye')}
        </button>
      </div>
    </div>
  `;
}

/** Call once after rendering any passwordField()s into `root` to wire up the toggle buttons. */
export function wirePasswordToggles(root){
  qsa('[data-password-toggle]', root).forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = root.querySelector(`#${btn.dataset.passwordToggle}`);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.setAttribute('aria-pressed', String(!showing));
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      btn.innerHTML = icon(showing ? 'eye' : 'eyeOff');
    });
  });
}
