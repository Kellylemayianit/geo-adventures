const THEME_KEY = 'gak_theme';

export function getStoredTheme(){
  return localStorage.getItem(THEME_KEY); // 'light' | 'dark' | null (null = follow system)
}

export function resolvedTheme(){
  const stored = getStoredTheme();
  if (stored) return stored;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
}

/** Call once, as early as possible, to avoid a flash of the wrong theme on load. */
export function initTheme(){
  applyTheme(resolvedTheme());
}

export function toggleTheme(){
  const next = resolvedTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  return next;
}
