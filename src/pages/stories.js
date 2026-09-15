import { render } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { storyCard } from '../components/card.js';
import { getStories } from '../services/dataLoader.js';

export async function mount(container){
  const stories = await getStories();
  render(container, `
    ${renderPageBanner({ image: 'assets/img/banner-stories.svg', title: 'Stories', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Stories' }] })}
    <section class="section">
      <div class="container grid grid-3">
        ${stories.map(storyCard).join('')}
      </div>
    </section>
  `);
}
