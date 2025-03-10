const CACHE_NAME = "session-plus-cache";
const FILES_TO_CACHE = [
    "/",
    "/home.html",
    "/styles.css",
    "/app.js",
    "/manifest.json",
    "/icons/icon-192x192.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
