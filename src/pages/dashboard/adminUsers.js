import { render, qs, qsa, formatDate, showToast, openModal, closeModal } from '../../utilities/helpers.js';
import { renderSidebar } from '../../components/admin/sidebar.js';
import { dataTable } from '../../components/admin/table.js';
import { passwordField, wirePasswordToggles } from '../../components/passwordField.js';
import { isAdmin } from '../../utilities/auth.js';
import { fetchAdminUsers, resetUserPasswordRequest, setUserRoleRequest } from '../../services/api.js';

const ROLE_LABEL = { admin: 'Admin', moderator: 'Moderator', client: 'Client' };

export async function mount(container){
  render(container, `
    <div class="dash-shell">
      <div id="dash-sidebar-mount"></div>
      <main class="dash-main">
        <div class="dash-header">
          <div>
            <span class="eyebrow">Staff</span>
            <h2 style="margin-bottom:0">Users</h2>
          </div>
        </div>
        <div class="panel" id="users-panel"></div>
      </main>
    </div>
  `);

  renderSidebar(qs('#dash-sidebar-mount', container), { active: '#/admin/users' });
  container._refresh = () => refresh(container);
  await refresh(container);
}

export async function activate(container){
  if (container._refresh) await container._refresh();
}

async function refresh(container){
  const panel = qs('#users-panel', container);
  const canAssign = isAdmin();
  let users = [];
  try {
    users = await fetchAdminUsers();
  } catch (e){
    panel.innerHTML = `<p class="muted">Could not load users: ${e.message}</p>`;
    return;
  }
  panel.innerHTML = `
    <div class="panel-head"><h4>All accounts (${users.length})</h4></div>
    <p class="muted" style="font-size:.85rem;margin-top:-.4rem;margin-bottom:1rem">
      ${canAssign
        ? 'Promote someone to Moderator (bookings + users) or Admin (full control). They must log in again after a role change.'
        : 'Only an administrator can change roles. You can still reset a password.'}
    </p>
    ${dataTable({
      columns: ['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'],
      rows: users.map((u) => [
        u.name, u.email, u.phone || '\u2014',
        canAssign
          ? `<select class="select-field" data-role="${u.id}" style="min-width:8.5rem;margin:0">
              ${['client', 'moderator', 'admin'].map((r) =>
                `<option value="${r}" ${u.role === r ? 'selected' : ''}>${ROLE_LABEL[r]}</option>`
              ).join('')}
            </select>`
          : (ROLE_LABEL[u.role] || u.role),
        formatDate(u.created_at),
        `<div class="row-actions"><button data-reset="${u.id}" data-name="${u.name}">Reset password</button></div>`,
      ]),
    })}
  `;

  qsa('[data-reset]', panel).forEach((btn) => btn.addEventListener('click', () => {
    openResetModal(btn.dataset.reset, btn.dataset.name);
  }));
  qsa('[data-role]', panel).forEach((sel) => sel.addEventListener('change', async () => {
    const role = sel.value;
    try {
      await setUserRoleRequest(sel.dataset.role, role);
      showToast(`Role updated to ${ROLE_LABEL[role]}. They should log in again.`, 'success');
    } catch (err){
      showToast(err.message, 'error');
      await refresh(container);
    }
  }));
}

function openResetModal(userId, name){
  const modalRoot = openModal(`
    <h4>Reset password for ${name}</h4>
    <p class="muted" style="font-size:.88rem">Set a temporary password, then tell them the new one over WhatsApp or a call.</p>
    <form id="reset-pw-form" novalidate>
      ${passwordField({ id: 'rp-new', name: 'newPassword', label: 'New password', minlength: 4 })}
      <button class="btn btn-primary btn-block" type="submit">Set New Password</button>
    </form>
  `);
  wirePasswordToggles(modalRoot);
  qs('#reset-pw-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newPassword = fd.get('newPassword');
    try {
      await resetUserPasswordRequest(userId, newPassword);
      showToast('Password reset. Share it with them directly.', 'success');
      closeModal();
    } catch (err){
      showToast(err.message, 'error');
    }
  });
}
