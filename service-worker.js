self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache').then((cache) => {
            return cache.addAll([
                '/TheSessionPlus/index.html',
                '/TheSessionPlus/styles.css',
                '/TheSessionPlus/app.js',
                '/TheSessionPlus/manifest.json',
                '/TheSessionPlus/icons/icon-192x192.png',
                '/TheSessionPlus/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
