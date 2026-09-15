const LINKS = [['overview','Overview'],['bookings','Bookings'],['packages','Packages'],['accommodations','Accommodations'],['settings','Settings']];

export function adminShell(sub, content){
  return `
  <section class="section wrap">
    <div class="eyebrow">Admin</div>
    <h1 class="h2" style="margin-top:8px; margin-bottom:24px;">Dashboard</h1>
    <div class="dash-layout">
      <div class="dash-sidebar panel">
        ${LINKS.map(([r,l])=>`<a href="#" data-nav="admin" data-admin-sub="${r}" class="${sub===r?'active':''}">${l}</a>`).join('')}
      </div>
      <div>
        ${content}
        <nav class="dash-bottom-nav">
          ${LINKS.map(([r,l])=>`<a href="#" data-nav="admin" data-admin-sub="${r}" class="${sub===r?'active':''}">${l}</a>`).join('')}
        </nav>
      </div>
    </div>
  </section>`;
}
