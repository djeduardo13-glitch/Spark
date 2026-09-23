/* =========================================================================
   SPARK DOC HUB — SERVICE WORKER
   Rende l'app installabile e utilizzabile offline.
   Aggiorna CACHE_NAME (es. v2, v3...) quando cambi questo file per forzare
   la pulizia della cache vecchia nei dispositivi degli utenti.
   ========================================================================= */

const CACHE_NAME = "spark-doc-hub-v1";

// File essenziali per far partire l'app anche offline.
const PRECACHE_URLS = [
  "./",
  "index.html",
  "manutenzione-form.html",
  "manifest.json",
  "css/style.css",
  "js/data.js",
  "js/app.js",
  "js/storage.js",
  "js/vendor/html2pdf.bundle.min.js",
  "assets/logo-stem.png",
  "assets/icons/app/icon-192.png",
  "assets/icons/app/icon-512.png",
  "assets/icons/app/icon-maskable-192.png",
  "assets/icons/app/icon-maskable-512.png",
  "assets/icons/app/apple-touch-icon.png",
  "assets/icons/app/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

function isAppLogic(url) {
  return /\.(html|js|css)$/.test(url.pathname) || url.pathname.endsWith("manifest.json");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // lascia passare CDN/font esterni

  if (isAppLogic(url)) {
    // Codice/markup: prova la rete per avere sempre l'ultima versione,
    // usa la cache solo se sei offline.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match("index.html")))
    );
  } else {
    // Immagini/librerie/altri asset: usa la cache se c'è, altrimenti la rete
    // (e salva il risultato per la prossima volta offline).
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        });
      })
    );
  }
});
