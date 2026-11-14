// Guarda la "carcasa" de la app para que abra al instante (sin datos: los datos viven en Google, protegidos con PIN).
const C = 'fo2627-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return; // los datos de Google nunca se guardan aquí
  // Primero la caché (abre al instante) y por detrás se actualiza para la próxima vez
  e.respondWith(caches.open(C).then(c => c.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
