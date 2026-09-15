import { render, formatDate } from '../utilities/helpers.js';
import { renderPageBanner } from '../components/hero.js';
import { getStory, getStories } from '../services/dataLoader.js';
import { storyCard } from '../components/card.js';

export async function mount(container, { params }){
  const story = await getStory(params.slug);
  if (!story){
    render(container, `<div class="section container text-center"><h2>Story not found</h2><a class="btn btn-primary" href="#/stories">Back to stories</a></div>`);
    return;
  }
  const others = (await getStories()).filter((s) => s.slug !== story.slug).slice(0, 3);

  render(container, `
    ${renderPageBanner({ image: story.image, title: story.title, crumbs: [{ label: 'Home', href: '#/' }, { label: 'Stories', href: '#/stories' }, { label: story.title }] })}
    <section class="section">
      <div class="container" style="max-width:760px">
        <p class="muted">${formatDate(story.date)}</p>
        <p style="font-size:1.15rem">${story.body}</p>
      </div>
    </section>
    ${others.length ? `
    <section class="section" style="background:var(--paper-dim)">
      <div class="container">
        <h3>More stories</h3>
        <div class="grid grid-3">${others.map(storyCard).join('')}</div>
      </div>
    </section>` : ''}
  `);
}
