import { render, qs, showToast } from '../utilities/helpers.js';
import { signIn } from '../utilities/auth.js';
import { navigate } from '../router.js';

export async function mount(container){
  render(container, `
    <section class="auth-shell">
      <div class="auth-card">
        <h3>Welcome back</h3>
        <p class="muted text-center">Log in to view your bookings or manage the site.</p>
        <form id="login-form" novalidate>
          <div class="field-group">
            <label class="field-label" for="li-email">Email</label>
            <input class="text-field" id="li-email" name="email" type="email" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="li-password">Password</label>
            <input class="text-field" id="li-password" name="password" type="password" required>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Log In</button>
        </form>
        <p class="auth-switch">New here? <a href="#/signup">Create an account</a></p>
        <p class="muted text-center" style="font-size:.78rem;margin-top:1rem">Admin demo login: kellylemayian6@gmail.com / admin123</p>
      </div>
    </section>
  `);

  qs('#login-form', container).addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const fd = new FormData(e.target);
    const fields = Object.fromEntries(fd.entries());
    const result = await signIn(fields);
    submitBtn.disabled = false;
    if (!result.ok){
      showToast(result.error, 'error');
      return;
    }
    showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
    navigate(result.user.role === 'admin' ? '#/admin' : '#/dashboard');
  });
}
