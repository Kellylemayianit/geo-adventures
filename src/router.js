// Minimal hash router: #/route/:param?key=value
const listeners = new Set();
let routes = [];

function toRegex(pattern){
  const paramNames = [];
  const regexStr = pattern
    .replace(/\/:([^/]+)/g, (_, name) => { paramNames.push(name); return '/([^/?]+)'; })
    .replace(/\//g, '\\/');
  return { regex: new RegExp(`^${regexStr}$`), paramNames };
}

export function defineRoutes(routeTable){
  routes = routeTable.map((r) => ({ ...r, ...toRegex(r.path) }));
}

export function parseHash(){
  const raw = window.location.hash.slice(1) || '/';
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart || '/';
  const query = {};
  if (queryPart){
    new URLSearchParams(queryPart).forEach((v, k) => { query[k] = v; });
  }
  return { path, query };
}

export function matchRoute(path){
  for (const route of routes){
    const m = path.match(route.regex);
    if (m){
      const params = {};
      route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
      return { route, params };
    }
  }
  return null;
}

export function onRouteChange(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function startRouter(){
  const handle = () => {
    const { path, query } = parseHash();
    const matched = matchRoute(path);
    listeners.forEach((fn) => fn({ path, query, matched }));
  };
  window.addEventListener('hashchange', handle);
  window.addEventListener('DOMContentLoaded', handle);
  if (document.readyState !== 'loading') handle();
}

export function navigate(hashPath){
  window.location.hash = hashPath;
}
