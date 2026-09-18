// Real auth against the Worker's /api/auth endpoints. Session (token + user) lives in
// localStorage via session.js so a page refresh doesn't log people out.
import { loginRequest, signupRequest, changePasswordRequest } from '../services/api.js';
import { getStoredUser, setSession, clearSession } from './session.js';

const listeners = new Set();

export function currentUser(){
  return getStoredUser();
}
export function isLoggedIn(){
  return !!getStoredUser();
}
export function isAdmin(){
  const u = getStoredUser();
  return !!u && u.role === 'admin';
}
export function onAuthChange(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function signIn({ email, password }){
  try {
    const { token, user } = await loginRequest(email, password);
    setSession(token, user);
    listeners.forEach((fn) => fn(user));
    return { ok: true, user };
  } catch (e){
    return { ok: false, error: e.message };
  }
}

export async function signUp({ name, email, password, phone }){
  try {
    const { token, user } = await signupRequest(name, email, password, phone);
    setSession(token, user);
    listeners.forEach((fn) => fn(user));
    return { ok: true, user };
  } catch (e){
    return { ok: false, error: e.message };
  }
}

export async function changePassword(currentPassword, newPassword){
  try {
    await changePasswordRequest(currentPassword, newPassword);
    return { ok: true };
  } catch (e){
    return { ok: false, error: e.message };
  }
}

export function signOut(){
  clearSession();
  listeners.forEach((fn) => fn(null));
}

export function requireAuth(role){
  const user = currentUser();
  if (!user) return false;
  if (role && user.role !== role) return false;
  return true;
}
