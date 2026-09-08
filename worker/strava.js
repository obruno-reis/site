/**
 * Cloudflare Worker — última atividade do Strava para o widget de avatar do site.
 *
 * O site é estático (não guarda segredos). Este Worker guarda as credenciais do
 * Strava, troca o refresh_token por um access_token, busca a atividade mais
 * recente e devolve um JSON enxuto, com CORS liberado só para o site.
 *
 * Segredos (wrangler secret put ...): STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN
 * Variável opcional (wrangler.toml [vars]): ALLOW_ORIGIN (default abaixo).
 *
 * Setup completo em ../STRAVA-WORKER.md
 */

const DEFAULT_ORIGIN = 'https://brunoreis.cc';
const CACHE_SECONDS = 600; // 10 min: evita bater no rate limit do Strava a cada visita

export default {
  async fetch(request, env, ctx) {
    const origin = env.ALLOW_ORIGIN || DEFAULT_ORIGIN;
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'GET') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    // Cache de borda (Cache API), chaveado pela URL do Worker.
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).origin + '/strava/latest', request);
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { headers: { ...cors, 'Content-Type': 'application/json', 'X-Cache': 'HIT' } });
    }

    try {
      const token = await getAccessToken(env);
      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) return json({ error: 'strava_' + res.status }, 502, cors);

      const list = await res.json();
      if (!Array.isArray(list) || !list.length) return json({ error: 'no_activity' }, 404, cors);

      const a = list[0];
      const out = {
        id: a.id,
        name: a.name,
        type: a.sport_type || a.type,
        distance: a.distance,          // metros
        moving_time: a.moving_time,    // segundos
        start_date: a.start_date,      // ISO UTC
      };

      const payload = JSON.stringify(out);
      const response = new Response(payload, {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'max-age=' + CACHE_SECONDS, 'X-Cache': 'MISS' },
      });
      // grava no cache de borda (sem o header X-Cache)
      ctx.waitUntil(cache.put(cacheKey, new Response(payload, {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=' + CACHE_SECONDS },
      })));
      return response;
    } catch (e) {
      return json({ error: 'exception', detail: String(e && e.message || e) }, 500, cors);
    }
  },
};

async function getAccessToken(env) {
  const body = new URLSearchParams({
    client_id: env.STRAVA_CLIENT_ID,
    client_secret: env.STRAVA_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: env.STRAVA_REFRESH_TOKEN,
  });
  const r = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) throw new Error('oauth ' + r.status);
  const data = await r.json();
  return data.access_token;
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
