var CACHE = 'fmpradio-v1';
var ASSETS = [
  './',
  'index.html',
  'manifest.json',
  './assets/logo.png' // BREADCRUMB: Cache the logo for offline display
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Always go network-first for stream and API calls — never cache these
  if (
    e.request.url.includes('citrus3') ||
    e.request.url.includes('stream') ||
    e.request.url.includes('widgetbot') ||
    e.request.url.includes('discord')
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || new Response(
          '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>FMPRADIO — Offline</title></head>' +
          '<body style="background:#0a0e1a;color:#e8e6e1;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;">' +
          '<div>' +
          '<img src="./assets/logo.png" style="height:140px;margin-bottom:24px;"><br>' +
          '<h2 style="color:#eab308;font-size:1.5rem;margin-bottom:8px;">You\'re Offline</h2>' +
          '<p style="color:#9ca3af;margin-top:8px;">Check your connection and try again.</p>' +
          '<button onclick="location.reload()" style="margin-top:24px;padding:10px 24px;background:#b91c1c;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Try Again</button>' +
          '</div></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      });
    })
  );
});
