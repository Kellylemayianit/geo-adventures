// Pure localStorage read/write for the session. Split out from auth.js so api.js can read
// the token (for the Authorization header) without importing auth.js, which itself imports
// api.js — this file is the seam that avoids the circular dependency.
const TOKEN_KEY = 'gak_token';
const SESSION_KEY = 'gak_session';

export function getToken(){
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

export function setSession(token, user){
  if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user)); else localStorage.removeItem(SESSION_KEY);
}

export function clearSession(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}
