import { render, qs, showToast } from '../utilities/helpers.js';
import { signUp } from '../utilities/auth.js';
import { navigate } from '../router.js';

export async function mount(container){
  render(container, `
    <section class="auth-shell">
      <div class="auth-card">
        <h3>Create your account</h3>
        <p class="muted text-center">Sign up to track your bookings and get faster checkout next time.</p>
        <form id="signup-form" novalidate>
          <div class="field-group">
            <label class="field-label" for="su-name">Full name</label>
            <input class="text-field" id="su-name" name="name" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="su-email">Email</label>
            <input class="text-field" id="su-email" name="email" type="email" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="su-phone">Phone</label>
            <input class="text-field" id="su-phone" name="phone" placeholder="0113556385" required>
          </div>
          <div class="field-group">
            <label class="field-label" for="su-password">Password</label>
            <input class="text-field" id="su-password" name="password" type="password" required minlength="4">
          </div>
          <button class="btn btn-primary btn-block" type="submit">Create Account</button>
        </form>
        <p class="auth-switch">Already have an account? <a href="#/login">Log in</a></p>
      </div>
    </section>
  `);

  qs('#signup-form', container).addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fields = Object.fromEntries(fd.entries());
    const result = signUp(fields);
    if (!result.ok){
      showToast(result.error, 'error');
      return;
    }
    showToast(`Welcome, ${result.user.name.split(' ')[0]}!`, 'success');
    navigate('#/dashboard');
  });
}
