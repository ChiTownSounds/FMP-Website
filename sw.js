var CACHE_NAME = 'fmpradio-v2'; // BREADCRUMB: Incremented for visual/engine updates
var ASSETS = [
  './',
  'index.html',
  'manifest.json',
  './assets/logo.svg',
  './assets/logo.png',
  'https://cdn.tailwindcss.com/3.4.17'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("[Service Worker] Hardening Cache...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  const url = e.request.url;

  // ── 1. BYPASS FOR LIVE DATA ─────────────────────────────────────
  // We NEVER cache the stream or live API telemetry
  if (
    url.includes('citrus3') ||
    url.includes('stream') ||
    url.includes('widgetbot') ||
    url.includes('discord')
  ) {
    return;
  }

  // ── 2. STALE-WHILE-REVALIDATE STRATEGY ─────────────────────────
  // Ideal for hardware skins and assets: Load from cache instantly,
  // then update the cache in the background for next time.
  e.respondWith(
    caches.match(e.request).then(function(cachedResponse) {
      const fetchPromise = fetch(e.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch(function() {
        return cachedResponse || handleOfflineFallback();
      });

      return cachedResponse || fetchPromise;
    })
  );
});

function handleOfflineFallback() {
  return new Response(
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>FMPRADIO — Offline</title></head>' +
    '<body style="background:#050507;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;">' +
    '<div>' +
    '<h2 style="color:#eab308;font-size:2rem;font-weight:900;margin-bottom:8px;">OFFLINE</h2>' +
    '<p style="color:#9ca3af;margin-top:8px;">The signal is lost. Reconnecting...</p>' +
    '<button onclick="location.reload()" style="margin-top:24px;padding:12px 32px;background:#b91c1c;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;letter-spacing:2px;">RETRY</button>' +
    '</div></body></html>',
    { headers: { 'Content-Type': 'text/html' } }
  );
}
