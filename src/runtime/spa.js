// React-style keep-alive for a vanilla SPA:
// each route owns a persistent host node. We mount into that host (even while
// hidden / detached) and only *reveal* it if it is still the current route.
// Jumping A → B → A never lets B's slower fetch overwrite A, and returning to
// A is instant because the node is still in memory.

const cache = new Map();
const inflight = new Map();

export function peekView(key){
  return cache.get(key);
}

export function clearViewCache(){
  for (const rec of cache.values()) rec.el.remove();
  cache.clear();
  inflight.clear();
}

export function hideLoading(mainEl){
  const o = mainEl.querySelector('.nav-loading');
  if (o) o.hidden = true;
}

export function showLoading(mainEl){
  let o = mainEl.querySelector('.nav-loading');
  if (!o){
    o = document.createElement('div');
    o.className = 'nav-loading';
    o.innerHTML = '<p class="muted">Loading…</p>';
    mainEl.appendChild(o);
  }
  o.hidden = false;
}

export function showView(mainEl, key){
  hideLoading(mainEl);
  const err = mainEl.querySelector('.nav-error');
  if (err) err.hidden = true;
  for (const [k, rec] of cache){
    rec.el.hidden = k !== key;
  }
}

export async function ensureView({ key, mainEl, load, mountArgs, stillCurrent }){
  const existing = cache.get(key);
  if (existing){
    if (!existing.el.parentNode) mainEl.appendChild(existing.el);
    showView(mainEl, key);
    if (typeof existing.mod.activate === 'function'){
      try { await existing.mod.activate(existing.el, mountArgs); }
      catch (e){ if (e.name !== 'AbortError') console.error(e); }
    }
    return existing;
  }

  if (inflight.has(key)){
    const rec = await inflight.get(key);
    if (stillCurrent() && rec){
      if (!rec.el.parentNode) mainEl.appendChild(rec.el);
      showView(mainEl, key);
    }
    return rec;
  }

  const job = (async () => {
    const el = document.createElement('div');
    el.className = 'page-host';
    el.dataset.view = key;
    el.hidden = true;
    const mod = await load();
    await mod.mount(el, mountArgs);
    const rec = { el, mod };
    cache.set(key, rec);
    return rec;
  })();

  inflight.set(key, job);
  try {
    const rec = await job;
    if (stillCurrent() && rec){
      if (!rec.el.parentNode) mainEl.appendChild(rec.el);
      showView(mainEl, key);
    }
    return rec;
  } catch (e){
    cache.delete(key);
    throw e;
  } finally {
    inflight.delete(key);
  }
}
