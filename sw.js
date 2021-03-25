const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'style/base.css',
    'js/app.js',
    'js/base.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js '
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    e.waitUntil(Promise.all([cacheStatic]));
});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            } else if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            } else if (key !== INMUTABLE_CACHE && key.includes('inmutable')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {

            return fetch(e.request).then(newRes => {

                if (newRes.ok) {

                    return caches.open(DYNAMIC_CACHE).then(cache => {

                        cache.put(e.request, newRes.clone());

                        return newRes.clone()

                    });

                } else {

                    return res;

                }
            });

        }

    });

    e.respondWith(respuesta);
});