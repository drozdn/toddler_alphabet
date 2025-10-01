const CACHE_NAME = "alphabet-app-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Add all alphabet images dynamically
const alphabetImages = [
  "images/arbuz.png","images/balon.png","images/czesc.png","images/dom.png",
  "images/ekran.png","images/foka.png","images/gruszka.png","images/herbata.png",
  "images/igla.png","images/jablko.png","images/kon.png","images/lampka.png",
  "images/mysz.png","images/narty.png","images/owca.png","images/pies.png",
  "images/rower.png","images/ser.png","images/talerz.png","images/ul.png",
  "images/woda.png","images/yeti.png","images/zamek.png"
];

const ALL_ASSETS = ASSETS.concat(alphabetImages);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ALL_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
