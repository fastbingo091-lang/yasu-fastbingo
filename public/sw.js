// Minimal service worker enabling PWA installability + offline shell.
const CACHE = "fastbingo-v4";
const ASSETS = ["/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never intercept anything that isn't a same-origin static image asset.
  // Caching JS modules / navigation requests breaks Vite/TanStack dynamic
  // imports (stale "virtual:tanstack-start-client-entry" chunks).
  if (url.origin !== self.location.origin) return;
  const isStaticAsset = /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname);
  if (!isStaticAsset) return;

  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
    )
  );
});
