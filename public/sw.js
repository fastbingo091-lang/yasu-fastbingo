// Disabled service worker: older versions cached app JS and could keep serving
// stale chunks after deploys, causing "This page didn't load" retry loops.
const CACHE = "fastbingo-v5-disabled";
const ASSETS = [];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Let every request go directly to the network.
  return;
});
