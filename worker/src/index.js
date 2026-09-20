// Geo Adventures Kenya — API Worker
// Zero dependencies on purpose so `wrangler deploy` works with nothing to npm install.
// Routes mirror src/services/api.js on the frontend 1:1 — see README in this folder.

const JSON_HEADERS = { 'content-type': 'application/json;charset=UTF-8' };

function corsHeaders(env){
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(data, status, env){
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...corsHeaders(env) } });
}
function err(message, status, env){
  return json({ error: message }, status, env);
}

/* ---------------- crypto helpers ---------------- */

function bufToHex(buf){
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function hexToBuf(hex){
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes.buffer;
}

async function hashPassword(password, saltHex){
  const salt = saltHex ? hexToBuf(saltHex) : crypto.getRandomValues(new Uint8Array(16)).buffer;
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return { hash: bufToHex(bits), salt: bufToHex(salt) };
}

async function verifyPassword(password, saltHex, expectedHashHex){
  const { hash } = await hashPassword(password, saltHex);
  return hash === expectedHashHex;
}

async function signToken(payload, secret){
  const body = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `${body}.${bufToHex(sig)}`;
}

async function verifyToken(token, secret){
  if (!token) return null;
  const [body, sigHex] = token.split('.');
  if (!body || !sigHex) return null;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expectedSig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  if (bufToHex(expectedSig) !== sigHex) return null;
  try { return JSON.parse(atob(body)); } catch { return null; }
}

async function getAuthUser(request, env){
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return verifyToken(token, env.WORKER_SECRET);
}

/* ---------------- route handlers ---------------- */

async function listDestinations(env){
  const { results } = await env.DB.prepare('SELECT * FROM destinations').all();
  return results.map(rowDestination);
}
function isAdmin(user){ return !!user && user.role === 'admin'; }
function isStaff(user){ return !!user && (user.role === 'admin' || user.role === 'moderator'); }

const ALLOWED_ROLES = ['client', 'moderator', 'admin'];

function rowDestination(r){
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    region: r.region,
    tagline: r.tagline,
    description: r.description,
    image: r.image,
    activities: JSON.parse(r.activities || '[]'),
    bestFor: r.best_for,
    priceFromKes: r.price_from_kes,
  };
}

async function listPackages(env){
  const { results } = await env.DB.prepare('SELECT * FROM packages').all();
  return results.map(rowPackage);
}
function rowPackage(r){
  return {
    ...r,
    destinationIds: JSON.parse(r.destination_ids || '[]'),
    highlights: JSON.parse(r.highlights || '[]'),
    itinerary: JSON.parse(r.itinerary || '[]'),
    classLabel: r.class_label,
    stayTier: r.stay_tier,
    transportId: r.transport_id,
    pricePerPersonKes: r.price_per_person_kes,
  };
}

function rowBooking(r){
  return {
    id: r.id, userId: r.user_id, type: r.type, title: r.title, packageId: r.package_id,
    destinationIds: r.destination_ids ? JSON.parse(r.destination_ids) : [],
    stayTier: r.stay_tier, transportId: r.transport_id, travelers: r.travelers, days: r.days,
    children: r.children || 0, childrenDetails: r.children_details ? JSON.parse(r.children_details) : [],
    name: r.name, phone: r.phone, email: r.email, date: r.date, totalKes: r.total_kes,
    status: r.status, createdAt: r.created_at,
  };
}

export default {
  async fetch(request, env){
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders(env) });

    try {
      // ---- Public catalogue reads ----
      if (path === '/api/destinations' && method === 'GET'){
        return json(await listDestinations(env), 200, env);
      }
      if (path.match(/^\/api\/destinations\/[^/]+$/) && method === 'GET'){
        const slug = path.split('/').pop();
        const r = await env.DB.prepare('SELECT * FROM destinations WHERE slug = ?').bind(slug).first();
        return r ? json(rowDestination(r), 200, env) : err('Not found', 404, env);
      }
      if (path === '/api/stay-tiers' && method === 'GET'){
        const { results } = await env.DB.prepare('SELECT * FROM stay_tiers').all();
        return json(results.map((r) => ({ id: r.id, label: r.label, pricePerNightKes: r.price_per_night_kes, description: r.description })), 200, env);
      }
      if (path === '/api/transport' && method === 'GET'){
        const { results } = await env.DB.prepare('SELECT * FROM transport_options').all();
        return json(results.map((r) => ({ id: r.id, label: r.label, pricePerDayKes: r.price_per_day_kes, capacity: r.capacity, icon: r.icon, description: r.description })), 200, env);
      }
      if (path === '/api/packages' && method === 'GET'){
        return json(await listPackages(env), 200, env);
      }
      if (path.match(/^\/api\/packages\/[^/]+$/) && method === 'GET'){
        const slug = path.split('/').pop();
        const r = await env.DB.prepare('SELECT * FROM packages WHERE slug = ?').bind(slug).first();
        return r ? json(rowPackage(r), 200, env) : err('Not found', 404, env);
      }
      if (path === '/api/team' && method === 'GET'){
        const { results } = await env.DB.prepare('SELECT * FROM team').all();
        return json(results, 200, env);
      }
      if (path === '/api/stories' && method === 'GET'){
        const { results } = await env.DB.prepare('SELECT * FROM stories').all();
        return json(results, 200, env);
      }
      if (path.match(/^\/api\/stories\/[^/]+$/) && method === 'GET'){
        const slug = path.split('/').pop();
        const r = await env.DB.prepare('SELECT * FROM stories WHERE slug = ?').bind(slug).first();
        return r ? json(r, 200, env) : err('Not found', 404, env);
      }
      if (path === '/api/testimonials' && method === 'GET'){
        const { results } = await env.DB.prepare('SELECT * FROM testimonials').all();
        return json(results, 200, env);
      }

      // ---- Auth ----
      if (path === '/api/auth/signup' && method === 'POST'){
        const body = await request.json();
        const { name, email, phone, password } = body;
        if (!name || !email || !password) return err('Name, email and password are required.', 400, env);
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (existing) return err('An account with that email already exists.', 409, env);
        const { hash, salt } = await hashPassword(password);
        const id = 'u' + Date.now();
        const createdAt = new Date().toISOString();
        await env.DB.prepare(
          'INSERT INTO users (id, name, email, phone, password_hash, password_salt, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, name, email.toLowerCase(), phone || '', hash, salt, 'client', createdAt).run();
        const user = { id, name, email: email.toLowerCase(), phone, role: 'client', createdAt };
        const token = await signToken({ id, role: 'client' }, env.WORKER_SECRET);
        return json({ token, user }, 201, env);
      }

      if (path === '/api/auth/login' && method === 'POST'){
        const body = await request.json();
        const { email, password } = body;
        const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind((email || '').toLowerCase()).first();
        if (!row) return err('No account found with that email.', 401, env);
        const ok = await verifyPassword(password, row.password_salt, row.password_hash);
        if (!ok) return err('Incorrect password.', 401, env);
        const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, createdAt: row.created_at };
        const token = await signToken({ id: row.id, role: row.role }, env.WORKER_SECRET);
        return json({ token, user }, 200, env);
      }

      // ---- Self-service password change (requires current password) ----
      if (path === '/api/auth/change-password' && method === 'POST'){
        const authUser = await getAuthUser(request, env);
        if (!authUser) return err('Login required.', 401, env);
        const { currentPassword, newPassword } = await request.json();
        if (!currentPassword || !newPassword || newPassword.length < 4){
          return err('Current password and a new password (4+ characters) are required.', 400, env);
        }
        const row = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(authUser.id).first();
        if (!row) return err('Account not found.', 404, env);
        const ok = await verifyPassword(currentPassword, row.password_salt, row.password_hash);
        if (!ok) return err('Current password is incorrect.', 401, env);
        const { hash, salt } = await hashPassword(newPassword);
        await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, row.id).run();
        return json({ ok: true }, 200, env);
      }

      // ---- Admin: list users / reset a user's password by hand (WhatsApp-mediated) ----
      if (path === '/api/admin/users' && method === 'GET'){
        const authUser = await getAuthUser(request, env);
        if (!isStaff(authUser)) return err('Staff only.', 403, env);
        const { results } = await env.DB.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC').all();
        return json(results, 200, env);
      }
      if (path.match(/^\/api\/admin\/users\/[^/]+\/role$/) && method === 'PATCH'){
        const authUser = await getAuthUser(request, env);
        if (!isAdmin(authUser)) return err('Only an administrator can change roles.', 403, env);
        const userId = path.split('/')[4];
        const { role } = await request.json();
        if (!ALLOWED_ROLES.includes(role)) return err('Role must be client, moderator, or admin.', 400, env);
        const target = await env.DB.prepare('SELECT id, role FROM users WHERE id = ?').bind(userId).first();
        if (!target) return err('User not found.', 404, env);
        if (target.role === 'admin' && role !== 'admin'){
          const { c } = await env.DB.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'").first();
          if (c <= 1) return err('Cannot demote the last administrator.', 400, env);
        }
        await env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, userId).run();
        return json({ ok: true, id: userId, role }, 200, env);
      }
      if (path.match(/^\/api\/admin\/users\/[^/]+\/reset-password$/) && method === 'POST'){
        const authUser = await getAuthUser(request, env);
        if (!isStaff(authUser)) return err('Staff only.', 403, env);
        const userId = path.split('/')[4];
        const { newPassword } = await request.json();
        if (!newPassword || newPassword.length < 4) return err('New password must be at least 4 characters.', 400, env);
        const { hash, salt } = await hashPassword(newPassword);
        const result = await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, userId).run();
        if (!result.meta || result.meta.changes === 0) return err('User not found.', 404, env);
        return json({ ok: true }, 200, env);
      }

      // ---- Bookings ----
      if (path === '/api/bookings' && method === 'GET'){
        const authUser = await getAuthUser(request, env);
        if (!authUser) return err('Login required.', 401, env);
        let rows;
        if (isStaff(authUser)){
          rows = (await env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()).results;
        } else {
          rows = (await env.DB.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').bind(authUser.id).all()).results;
        }
        return json(rows.map(rowBooking), 200, env);
      }

      if (path === '/api/bookings' && method === 'POST'){
        const authUser = await getAuthUser(request, env); // optional — guest bookings allowed
        const body = await request.json();
        const required = ['type', 'title', 'name', 'phone', 'totalKes'];
        for (const key of required){
          if (body[key] === undefined || body[key] === null || body[key] === '') return err(`Missing field: ${key}`, 400, env);
        }
        const id = 'bk' + Date.now();
        const createdAt = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO bookings (id, user_id, type, title, package_id, destination_ids, stay_tier, transport_id, travelers, days, children, children_details, name, phone, email, date, total_kes, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `).bind(
          id, authUser?.id || null, body.type, body.title, body.packageId || null,
          body.destinationIds ? JSON.stringify(body.destinationIds) : null,
          body.stayTier || null, body.transportId || null, body.travelers || 1, body.days || null,
          body.children || 0, body.childrenDetails ? JSON.stringify(body.childrenDetails) : null,
          body.name, body.phone, body.email || null, body.date || null, body.totalKes, createdAt,
        ).run();
        return json({ id, status: 'pending', createdAt }, 201, env);
      }

      if (path.match(/^\/api\/bookings\/[^/]+$/) && method === 'PATCH'){
        const authUser = await getAuthUser(request, env);
        if (!isStaff(authUser)) return err('Staff only.', 403, env);
        const id = path.split('/').pop();
        const { status } = await request.json();
        if (!['pending', 'confirmed', 'cancelled'].includes(status)) return err('Invalid status.', 400, env);
        await env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, id).run();
        return json({ id, status }, 200, env);
      }

      return err('Not found', 404, env);
    } catch (e){
      return err(e.message || 'Server error', 500, env);
    }
  },
};
