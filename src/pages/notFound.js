import { render } from '../utilities/helpers.js';

export async function mount(container){
  render(container, `
    <section class="section container text-center" style="padding:6rem 0">
      <h1>404</h1>
      <p class="muted">We couldn't find that page — maybe it wandered off on safari.</p>
      <a class="btn btn-primary" href="#/">Back to Home</a>
    </section>
  `);
}
