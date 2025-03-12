self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache').then((cache) => {
            return cache.addAll([
                '/TheSessionPlus/index.html',
                '/TheSessionPlus/styles.css',
                '/TheSessionPlus/app.js',
                '/TheSessionPlus/manifest.json',
                new Request('/TheSessionPlus/icons/icon-192x192.png', { cache: 'reload' }),
                new Request('/TheSessionPlus/icons/icon-512x512.png', { cache: 'reload' })
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

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== 'app-cache') {
                        console.log('Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

