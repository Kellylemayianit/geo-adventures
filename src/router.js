/* ==========================================================
   ROUTER — hash parsing + change subscription.
   URL shape: #/<route>/<id>?key=value&key2=value2
   Both <id> and the query string are optional. app.js is the
   only module that decides what a route means; this file just
   turns the hash into { route, id, query } and back again.
   ========================================================== */

export function parseHash(hash = window.location.hash){
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart=''] = raw.split('?');
  const [route='home', id=null] = pathPart.split('/').filter(Boolean).length
    ? pathPart.split('/').filter(Boolean)
    : ['home'];
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  return { route, id, query };
}

export function buildHash(route, { id, query } = {}){
  let hash = `#/${route}`;
  if(id) hash += `/${id}`;
  const qs = new URLSearchParams(query || {}).toString();
  if(qs) hash += `?${qs}`;
  return hash;
}

export function navigate(route, opts = {}){
  const next = buildHash(route, opts);
  if(window.location.hash === next){
    // same hash won't fire hashchange — notify listeners manually
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = next;
  }
}

export function getRoute(){
  return parseHash();
}

export function subscribe(callback){
  const handler = () => callback(getRoute());
  window.addEventListener('hashchange', handler);
  callback(getRoute()); // fire once for the initial load
  return () => window.removeEventListener('hashchange', handler);
}
