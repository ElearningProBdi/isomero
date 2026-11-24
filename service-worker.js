// ISOMERO - Service Worker ANTI-VOL v2
// On ne cache QUE la coquille, JAMAIS les leçons
const CACHE_NAME = 'isomero-shell-v2';
const OFFLINE_URL = '/isomero/offline.html';

// 1. COQUILLE SEULEMENT - Pas de leçons, pas de données
const SHELL_FILES = [
  '/isomero/',
  '/isomero/index.html',
  '/isomero/manifest.json',
  '/isomero/icon-192.png',
  '/isomero/icon-512.png',
  '/isomero/offline.html'
];

// INSTALL - Sauvegarde la coquille
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .catch(() => console.log('ISOMERO: Shell cache failed'))
  );
  self.skipWaiting();
});

// ACTIVATE - Supprime les vieux caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('ISOMERO: Deleting old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH - La règle ANTI-VOL
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. FIREBASE = JAMAIS EN CACHE - Toujours vérifier en ligne
  // Clés, Scores, Certificats, Utilisateurs = toujours live
  if (
    url.includes('firestore') ||
    url.includes('firebase') ||
    url.includes('gstatic') ||
    url.includes('googleapis') ||
    url.includes('firebaseio')
  ) {
    // Network only - Si pas internet, ça échoue, c'est voulu
    return;
  }

  // 2. LEÇONS / API / DONNÉES = JAMAIS EN CACHE
  // Si quelqu'un transfère l'App, il n'a pas les leçons
  if (
    url.includes('/lessons/') ||
    url.includes('/api/') ||
    url.includes('lessons.json') ||
    url.includes('content.json')
  ) {
    return;
  }

  // 3. COQUILLE = Cache d'abord, sinon Network
  // index.html, manifest, icons = peuvent marcher offline
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Ne pas cacher les réponses qui ne sont pas OK
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // On ne cache que la coquille, pas les autres pages avec données
        // On clone pour ne pas casser le flux
        const responseToCache = response.clone();
        // Seulement si c'est un fichier shell
        if (SHELL_FILES.some(f => url.endsWith(f) || url === 'https://elearningpro-eac.github.io' + f)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Si offline et c'est une navigation, montre offline.html
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// MESSAGE - Pour forcer la mise à jour quand tu changes de version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
