/* FontLab service worker: offline support without ever serving stale files while online.
   Network first (always revalidated); the cache is only a fallback when the network fails.
   Cross-origin requests (Supabase) and version.json are never touched. */
const CACHE = 'fontlab-offline-v1';
const PRECACHE = ['./', 'index.html', 'manifest.webmanifest', 'src/fontlab.css', 'src/config.js', 'src/core.js', 'src/cloud.js', 'src/app.js',
  'data/fonts.js', 'data/schema.js', 'icons/icon.svg', 'icons/logo.svg', 'icons/favicon.ico', 'fonts/Prompt-Regular.ttf'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(PRECACHE.map(async u => { try { await c.add(new Request(u, { cache: 'reload' })); } catch {} }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('/version.json')) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(r, { cache: 'no-cache' });
      if (res.ok && res.type === 'basic') {
        const c = await caches.open(CACHE);
        await c.put(r, res.clone());
        for (const k of await c.keys()) { const ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) await c.delete(k); } /* drop older ?v= copies */
      }
      return res;
    } catch (err) {
      const hit = (await caches.match(r)) || (await caches.match(r, { ignoreSearch: true }));
      if (hit) return hit;
      if (r.mode === 'navigate') { const page = (await caches.match('index.html')) || (await caches.match('./')); if (page) return page; }
      throw err;
    }
  })());
});
