// Service Worker (Einzeldatei-Version): macht die App installierbar. Programmdateien kommen zuerst vom Netz, bei fehlender Verbindung aus dem Zwischenspeicher.
// Es werden nur Dateien dieser Seite gespeichert, keine Profil- oder Datenbankdaten.
const CACHE = 'casting-single-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r)));
});
