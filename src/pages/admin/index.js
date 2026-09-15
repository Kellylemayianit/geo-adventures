import { adminShell } from '../../components/admin/adminShell.js';
import { adminOverview } from './overview.js';
import { adminBookings } from './bookings.js';
import { adminPackages } from './packages.js';
import { adminAccommodations } from './accommodations.js';
import { adminSettings } from './settings.js';

export function pageAdmin({ sub, bookingFilter }){
  let content;
  if(sub==='bookings') content = adminBookings(bookingFilter);
  else if(sub==='packages') content = adminPackages();
  else if(sub==='accommodations') content = adminAccommodations();
  else if(sub==='settings') content = adminSettings();
  else content = adminOverview();
  return adminShell(sub, content);
}
