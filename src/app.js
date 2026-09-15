/* ==========================================================
   APP — the kernel. Route dispatch + all delegated event
   wiring lives here. Pages/components stay pure render
   functions; this file is the only place DOM events are bound.
   ========================================================== */
import * as router from './router.js';
import * as dataLoader from './services/dataLoader.js';
import * as auth from './utilities/auth.js';
import { $, toast, openModal, closeModal } from './utilities/helpers.js';
import { validateBooking, calcCustomPricePerPerson } from './utilities/booking.js';
import { waLink } from './utilities/channelLinks.js';

import { headerNav } from './components/header.js';
import { siteFooter } from './components/footer.js';
import { packageFormModal } from './components/admin/packageForm.js';
import { accommodationFormModal } from './components/admin/accForm.js';

import { pageHome } from './pages/home.js';
import { pageParksList } from './pages/parksList.js';
import { pageParkDetail } from './pages/parkDetail.js';
import { pagePackagesList } from './pages/packagesList.js';
import { pagePackageDetail } from './pages/packageDetail.js';
import { pageAccommodations } from './pages/accommodations.js';
import { pageLogin } from './pages/login.js';
import { pageRegister } from './pages/register.js';
import { pageMyBookings } from './pages/myBookings.js';
import { pageBooking, prebuiltSummary, customSummary } from './pages/booking.js';
import { pageAdmin } from './pages/admin/index.js';

/* -------- transient UI state that doesn't belong in the URL -------- */
const uiState = {
  bookingBuilder: { parks:[], days:3, accommodationTier:'mid', transport:'jeep', addOns:[] },
  pbGroupSize: 2,
};

function guardedRoute(route){
  if(route==='my-bookings' && !auth.isGuest()) return 'login';
  if(route==='admin' && !auth.isAdmin()) return 'login';
  return route;
}

function renderRoute({ route, id, query }){
  route = guardedRoute(route);
  let body;
  switch(route){
    case 'home': body = pageHome(); break;
    case 'parks': body = pageParksList(); break;
    case 'park-detail': body = pageParkDetail(id); break;
    case 'packages': body = pagePackagesList(query.filter || 'all'); break;
    case 'package-detail': body = pagePackageDetail(id); break;
    case 'accommodations': body = pageAccommodations(query.tier || 'all'); break;
    case 'booking':
      body = pageBooking({
        mode: query.mode || 'prebuilt',
        selectedPrebuiltId: query.package || null,
        builder: uiState.bookingBuilder,
        groupSize: uiState.pbGroupSize,
      });
      break;
    case 'login': body = pageLogin(); break;
    case 'register': body = pageRegister(); break;
    case 'my-bookings': body = pageMyBookings(); break;
    case 'admin':
      body = pageAdmin({ sub: query.sub || 'overview', bookingFilter: query.status || 'all' });
      break;
    default: body = pageHome();
  }
  $('#app').innerHTML = headerNav(route) + `<main>${body}</main>` + siteFooter();
  window.scrollTo(0,0);
}

function render(){ renderRoute(router.getRoute()); }

/* ---------------- EVENTS (delegated) ---------------- */
document.addEventListener('click', async (e) => {
  const navEl = e.target.closest('[data-nav]');
  if(navEl){
    e.preventDefault();
    const r = navEl.getAttribute('data-nav');
    const id = navEl.getAttribute('data-id');
    const prefill = navEl.getAttribute('data-prefill-package');
    const adminSub = navEl.getAttribute('data-admin-sub');
    if(r==='package-detail' || r==='park-detail') router.navigate(r, { id });
    else if(r==='booking' && prefill) router.navigate('booking', { query:{ mode:'prebuilt', package:prefill } });
    else if(r==='admin') router.navigate('admin', { query: adminSub ? { sub: adminSub } : {} });
    else router.navigate(r);
    return;
  }

  const fp = e.target.closest('[data-filter-package]');
  if(fp){ router.navigate('packages', { query:{ filter: fp.getAttribute('data-filter-package') } }); return; }

  const fa = e.target.closest('[data-filter-acc]');
  if(fa){ router.navigate('accommodations', { query:{ tier: fa.getAttribute('data-filter-acc') } }); return; }

  const fab = e.target.closest('[data-filter-admin-booking]');
  if(fab){ router.navigate('admin', { query:{ sub:'bookings', status: fab.getAttribute('data-filter-admin-booking') } }); return; }

  const bmode = e.target.closest('[data-booking-mode]');
  if(bmode){
    const { query } = router.getRoute();
    router.navigate('booking', { query:{ ...query, mode: bmode.getAttribute('data-booking-mode') } });
    return;
  }

  const ql = e.target.closest('[data-quick-login]');
  if(ql){
    const role = ql.getAttribute('data-quick-login');
    const user = role==='admin' ? auth.loginDemoAdmin() : auth.loginDemoGuest();
    toast(`Logged in as ${user.name} (${role})`);
    router.navigate(role==='admin' ? 'admin' : 'my-bookings');
    return;
  }

  if(e.target.id==='login-submit'){
    const email = $('#login-email').value.trim();
    if(!email){ toast('Enter your email to continue','err'); return; }
    await auth.login({ email });
    toast('Logged in successfully');
    router.navigate('my-bookings');
    return;
  }

  if(e.target.id==='register-submit'){
    const name = $('#reg-name').value.trim();
    const email = $('#reg-email').value.trim();
    if(!name||!email){ toast('Fill in your name and email','err'); return; }
    await auth.register({ name, email });
    toast('Account created — welcome!');
    router.navigate('my-bookings');
    return;
  }

  if(e.target.getAttribute('data-action')==='logout'){
    auth.logout(); toast('Logged out'); router.navigate('home'); return;
  }

  if(e.target.id==='pb-submit'){
    const byId = dataLoader.packagesById();
    const p = byId[$('#pb-package').value];
    const name = $('#pb-name').value.trim();
    const email = $('#pb-email').value.trim();
    const group = parseInt($('#pb-group').value||1,10);
    const date = $('#pb-date').value;
    const errors = validateBooking({name,email,date,group});
    if(errors.length){ toast(errors[0],'err'); return; }
    const total = p.price*group;
    const booking = { guestEmail:email, packageId:p.id, groupSize:group, startDate:date, status:'pending', totalPrice:total, createdAt:'2026-08-17' };
    const saved = await dataLoader.addBooking(booking);
    toast('Booking request submitted — redirecting to WhatsApp');
    setTimeout(()=>{ window.open(waLink(dataLoader.contact(), `Hi! I'd like to book "${p.name}" for ${group} guests starting ${date}. Booking ref ${saved.id}. Total est. ${dataLoader.money(total)}.`),'_blank'); },400);
    if(!auth.getCurrentUser()) await auth.login({ email });
    router.navigate('my-bookings');
    return;
  }

  if(e.target.id==='cb-submit'){
    const b = uiState.bookingBuilder;
    const name = $('#cb-name').value.trim();
    const email = $('#cb-email').value.trim();
    const group = parseInt($('#cb-group').value||1,10);
    const date = $('#cb-date').value;
    const errors = validateBooking({name,email,date,group,parks:b.parks});
    if(errors.length){ toast(errors[0],'err'); return; }
    const perPerson = calcCustomPricePerPerson(b, dataLoader.pricingRules(), dataLoader.addons());
    const booking = { guestEmail:email, packageId:null, groupSize:group, startDate:date, status:'pending', totalPrice:perPerson*group, createdAt:'2026-08-17' };
    const saved = await dataLoader.addBooking(booking);
    toast('Custom booking submitted — redirecting to WhatsApp');
    const byId = dataLoader.parksById();
    const parkNames = b.parks.map(id=>byId[id]?.name).join(', ');
    setTimeout(()=>{ window.open(waLink(dataLoader.contact(), `Hi! I'd like a custom safari: ${parkNames}, ${b.days} days, ${b.accommodationTier} stay, ${b.transport}. Booking ref ${saved.id}.`),'_blank'); },400);
    if(!auth.getCurrentUser()) await auth.login({ email });
    router.navigate('my-bookings');
    return;
  }

  if(e.target.getAttribute('data-action')==='close-modal'){ closeModal(); return; }
  if(e.target.closest('[data-modal-backdrop]') === e.target){ closeModal(); return; }

  if(e.target.getAttribute('data-action')==='admin-new-package'){ openModal(packageFormModal(null)); return; }
  if(e.target.closest('[data-action="admin-edit-package"]')){
    const id = e.target.closest('[data-action="admin-edit-package"]').getAttribute('data-id');
    openModal(packageFormModal(dataLoader.packagesById()[id]));
    return;
  }
  if(e.target.closest('[data-action="admin-delete-package"]')){
    const id = e.target.closest('[data-action="admin-delete-package"]').getAttribute('data-id');
    if(confirm('Delete this package? This cannot be undone.')){
      await dataLoader.removePackage(id);
      closeModal();
      toast('Package deleted');
      render();
    }
    return;
  }
  if(e.target.closest('[data-action="admin-save-package"]')){
    const id = e.target.closest('[data-action="admin-save-package"]').getAttribute('data-id');
    const selectedParks = Array.from(document.querySelectorAll('[data-package-form] [id^="pf-park-"]:checked')).map(i=>i.value);
    const patch = {
      name: $('#pf-name').value.trim(),
      img: $('#pf-img').value.trim(),
      parks: selectedParks,
      duration: parseInt($('#pf-duration').value||1,10),
      price: parseFloat($('#pf-price').value||0),
      accommodationTier: $('#pf-tier').value,
      transport: $('#pf-transport').value,
      rating: parseFloat($('#pf-rating').value||4.5),
      itinerary: $('#pf-itinerary').value.split('\n').map(s=>s.trim()).filter(Boolean),
      included: $('#pf-included').value.split('\n').map(s=>s.trim()).filter(Boolean),
      notIncluded: $('#pf-not-included').value.split('\n').map(s=>s.trim()).filter(Boolean),
    };
    if(!patch.name){ toast('Package needs a name','err'); return; }
    if(id) await dataLoader.editPackage(id, patch); else await dataLoader.addPackage(patch);
    closeModal();
    toast(id ? 'Package updated' : 'Package created');
    render();
    return;
  }

  if(e.target.getAttribute('data-action')==='admin-new-acc'){ openModal(accommodationFormModal(null)); return; }
  if(e.target.closest('[data-action="admin-edit-acc"]')){
    const id = e.target.closest('[data-action="admin-edit-acc"]').getAttribute('data-id');
    openModal(accommodationFormModal(dataLoader.accommodationsById()[id]));
    return;
  }
  if(e.target.closest('[data-action="admin-delete-acc"]')){
    const id = e.target.closest('[data-action="admin-delete-acc"]').getAttribute('data-id');
    if(confirm('Delete this accommodation? This cannot be undone.')){
      await dataLoader.removeAccommodation(id);
      closeModal();
      toast('Accommodation deleted');
      render();
    }
    return;
  }
  if(e.target.closest('[data-action="admin-save-acc"]')){
    const id = e.target.closest('[data-action="admin-save-acc"]').getAttribute('data-id');
    const patch = {
      name: $('#af-name').value.trim(),
      img: $('#af-img').value.trim(),
      parkId: $('#af-park').value,
      tier: $('#af-tier').value,
      price: parseFloat($('#af-price').value||0),
    };
    if(!patch.name){ toast('Accommodation needs a name','err'); return; }
    if(id) await dataLoader.editAccommodation(id, patch); else await dataLoader.addAccommodation(patch);
    closeModal();
    toast(id ? 'Accommodation updated' : 'Accommodation created');
    render();
    return;
  }

  if(e.target.getAttribute('data-action')==='admin-save-settings'){
    await dataLoader.saveSettings({
      companyName: $('#admin-set-company').value.trim(),
      contactEmail: $('#admin-set-email').value.trim(),
      whatsappNumber: $('#admin-set-whatsapp').value.trim(),
      defaultCurrency: $('#admin-set-currency').value,
    });
    toast('Settings saved');
    return;
  }
});

document.addEventListener('change', async (e) => {
  if(e.target.id==='currency-select' || e.target.matches('[data-currency-select]')){
    dataLoader.setCurrency(e.target.value);
    render();
    return;
  }
  if(e.target.id==='pb-package' || e.target.id==='pb-group'){
    const packageId = $('#pb-package').value;
    const group = parseInt($('#pb-group').value||1,10);
    uiState.pbGroupSize = group;
    const box = $('#pb-summary'); if(box) box.innerHTML = prebuiltSummary(packageId, group);
    return;
  }
  if(e.target.matches('[data-custom-park]')){
    const id = e.target.getAttribute('data-custom-park');
    const b = uiState.bookingBuilder;
    if(e.target.checked) b.parks.push(id); else b.parks = b.parks.filter(p=>p!==id);
    render();
    return;
  }
  if(e.target.matches('[data-custom-addon]')){
    const id = e.target.getAttribute('data-custom-addon');
    const b = uiState.bookingBuilder;
    if(e.target.checked) b.addOns.push(id); else b.addOns = b.addOns.filter(a=>a!==id);
    e.target.closest('.checkbox-card')?.classList.toggle('checked', e.target.checked);
    const box = $('#cb-summary'); if(box) box.innerHTML = customSummary(b);
    return;
  }
  if(e.target.id==='cb-days'){ uiState.bookingBuilder.days = parseInt(e.target.value||1,10); refreshCb(); return; }
  if(e.target.id==='cb-tier'){ uiState.bookingBuilder.accommodationTier = e.target.value; refreshCb(); return; }
  if(e.target.id==='cb-transport'){ uiState.bookingBuilder.transport = e.target.value; refreshCb(); return; }
  if(e.target.matches('[data-admin-status]')){
    const id = e.target.getAttribute('data-admin-status');
    await dataLoader.setBookingStatus(id, e.target.value);
    toast(`Booking ${id} marked ${e.target.value}`);
    render();
    return;
  }
});
function refreshCb(){ const box = $('#cb-summary'); if(box) box.innerHTML = customSummary(uiState.bookingBuilder); }

/* ---------------- BOOT ---------------- */
async function boot(){
  await dataLoader.init();
  router.subscribe(render);
}
boot();
