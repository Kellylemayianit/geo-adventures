import { render, qs, showToast } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { passwordField, wirePasswordToggles } from '../../components/passwordField.js';
import { changePassword, currentUser } from '../../utilities/auth.js';

export async function mount(container){
  const user = currentUser();
  const role = user.role === 'admin' ? 'admin' : 'client';

  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Account</span>
            <h2 style="margin-bottom:0">Change password</h2>
          </div>
        </div>
        <div class="panel" style="max-width:480px">
          <form id="change-password-form" novalidate>
            ${passwordField({ id: 'cp-current', name: 'currentPassword', label: 'Current password' })}
            ${passwordField({ id: 'cp-new', name: 'newPassword', label: 'New password', minlength: 4 })}
            ${passwordField({ id: 'cp-confirm', name: 'confirmPassword', label: 'Confirm new password', minlength: 4 })}
            <button class="btn btn-primary" type="submit">Update Password</button>
          </form>
          <p class="muted" style="font-size:.85rem;margin-top:1.2rem">Forgotten your password entirely and can't log in? Message us on WhatsApp from the Contact page and we'll reset it for you.</p>
        </div>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { role, active: '#/account/password' });
  wirePasswordToggles(container);

  qs('#change-password-form', container).addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fields = Object.fromEntries(fd.entries());
    if (fields.newPassword !== fields.confirmPassword){
      showToast('New password and confirmation don\u2019t match.', 'error');
      return;
    }
    const result = await changePassword(fields.currentPassword, fields.newPassword);
    if (!result.ok){
      showToast(result.error, 'error');
      return;
    }
    showToast('Password updated.', 'success');
    e.target.reset();
  });
}
