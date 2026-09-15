/* ==========================================================
   AUTH — mock login/session flag, held in memory for now.
   Swap the bodies of login()/register() (via services/api.js)
   for real calls once a Worker + D1 `users` table (and a
   session cookie or JWT) are wired up. currentUser stays the
   single source of truth the rest of the app reads from.
   ========================================================== */
import * as api from '../services/api.js';

let currentUser = null;

export function getCurrentUser(){ return currentUser; }
export function isGuest(){ return currentUser?.role==='guest'; }
export function isAdmin(){ return currentUser?.role==='admin'; }

export async function login(credentials){
  currentUser = await api.login(credentials);
  return currentUser;
}
export async function register(details){
  currentUser = await api.register(details);
  return currentUser;
}
export function loginDemoGuest(){ currentUser = { name:'Sarah Mwangi', email:'sarah@example.com', role:'guest' }; return currentUser; }
export function loginDemoAdmin(){ currentUser = { name:'Admin User', email:'admin@geoadventures.travel', role:'admin' }; return currentUser; }
export function logout(){ currentUser = null; }
