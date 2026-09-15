import { bookings, packagesById, money } from '../services/dataLoader.js';
import { getCurrentUser } from '../utilities/auth.js';
import { statCards } from '../components/statCards.js';
import { bookingCard } from '../components/card.js';

const TODAY = '2026-08-17';

export function pageMyBookings(){
  const user = getCurrentUser();
  let mine = bookings().filter(b=>b.guestEmail===user.email);
  if(!mine.length) mine = bookings().filter(b=>b.guestEmail==='sarah@example.com');
  const upcoming = mine.filter(b=>new Date(b.startDate)>=new Date(TODAY) && b.status!=='cancelled');
  const past = mine.filter(b=>new Date(b.startDate)<new Date(TODAY) || b.status==='cancelled');
  const byId = packagesById();
  const stats = statCards([
    {num:mine.length, lbl:'Total bookings'},
    {num:upcoming.length, lbl:'Upcoming trips'},
    {num:mine.filter(b=>b.status==='confirmed').length, lbl:'Confirmed'},
    {num:money(mine.reduce((s,b)=>s+b.totalPrice,0)), lbl:'Lifetime spend'},
  ]);
  return `
  <section class="section wrap">
    <div class="eyebrow">Guest dashboard</div>
    <h1 class="h2" style="margin-top:8px;">My bookings</h1>
    ${stats}
    <h3 class="h3" style="margin-top:8px;">Upcoming</h3>
    <div class="grid grid-2" style="margin-top:14px;">
      ${upcoming.map(b=>bookingCard(b, byId)).join('') || `<div class="empty-state">No upcoming trips yet. <a class="link-underline" data-nav="booking">Plan one →</a></div>`}
    </div>
    ${past.length?`
    <h3 class="h3" style="margin-top:30px;">Past &amp; cancelled</h3>
    <div class="grid grid-2" style="margin-top:14px;">${past.map(b=>bookingCard(b, byId)).join('')}</div>`:''}
  </section>`;
}
