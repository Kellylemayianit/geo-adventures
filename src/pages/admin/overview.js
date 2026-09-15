import { bookings, packagesById, money } from '../../services/dataLoader.js';
import { statCards } from '../../components/statCards.js';
import { bookingsTable } from '../../components/admin/table.js';

const TODAY = '2026-08-17';

export function adminOverview(){
  const list = bookings();
  const total = list.length;
  const revenue = list.filter(b=>b.status!=='cancelled').reduce((s,b)=>s+b.totalPrice,0);
  const pending = list.filter(b=>b.status==='pending').length;
  const upcoming = list.filter(b=>new Date(b.startDate)>=new Date(TODAY) && b.status!=='cancelled').length;
  const recent = [...list].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const stats = statCards([
    {num:total, lbl:'Total bookings', delta:'+3 this week'},
    {num:money(revenue), lbl:'Gross revenue', delta:'+12% vs last month'},
    {num:pending, lbl:'Awaiting confirmation'},
    {num:upcoming, lbl:'Upcoming departures'},
  ]);
  return `${stats}
  <div class="panel" style="padding:22px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div class="h3" style="font-size:17px;">Recent bookings</div>
      <button class="btn btn-outline btn-sm" data-nav="admin" data-admin-sub="bookings">View all →</button>
    </div>
    ${bookingsTable(recent, packagesById())}
  </div>`;
}
