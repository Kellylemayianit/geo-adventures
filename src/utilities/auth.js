// Mock auth. Session lives in localStorage only so a page refresh doesn't log people out
// mid-demo — there is no server behind this. Swap signIn/signUp bodies for real API calls later.
import { getUsers, saveUsers } from '../services/mockData.js';

const SESSION_KEY = 'gak_session';
const listeners = new Set();

function readSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}
function writeSession(user){
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  listeners.forEach((fn) => fn(user));
}

export function currentUser(){
  return readSession();
}
export function isLoggedIn(){
  return !!readSession();
}
export function isAdmin(){
  const u = readSession();
  return !!u && u.role === 'admin';
}
export function onAuthChange(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function signIn({ email, password }){
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return { ok: false, error: 'No account found with that email.' };
  if (user.password !== password) return { ok: false, error: 'Incorrect password.' };
  const { password: _pw, ...safeUser } = user;
  writeSession(safeUser);
  return { ok: true, user: safeUser };
}

export function signUp({ name, email, password, phone }){
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())){
    return { ok: false, error: 'An account with that email already exists.' };
  }
  const newUser = {
    id: 'u' + Date.now(),
    name, email, phone, password,
    role: 'client',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  const { password: _pw, ...safeUser } = newUser;
  writeSession(safeUser);
  return { ok: true, user: safeUser };
}

export function signOut(){
  writeSession(null);
}

export function requireAuth(role){
  const user = currentUser();
  if (!user) return false;
  if (role && user.role !== role) return false;
  return true;
}
