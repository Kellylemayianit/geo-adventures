import { render } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { storyCard } from '../components/card.js';
import { getStories } from '../services/dataLoader.js';

export async function mount(container){
  const stories = await getStories();
  render(container, `
    ${renderPageBanner({ image: 'https://commons.wikimedia.org/wiki/Special:FilePath/1993_158-11A_Masai_Mara_sunset.jpg', title: 'Stories', crumbs: [{ label: 'Home', href: '#/' }, { label: 'Stories' }] })}
    <section class="section">
      <div class="container grid grid-3">
        ${stories.map(storyCard).join('')}
      </div>
    </section>
  `);
}
