self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                console.log('REMOVING OLD CACHE:', key);
                return caches.delete(key);
            }));
        }).then(() => {
            console.log('SERVICE WORKER SELF-DESTRUCTING');
            return self.registration.unregister();
        }).then(() => {
            return self.clients.claim();
        })
    );
});
