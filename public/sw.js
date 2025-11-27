const CACHE_NAME = 'baraaka-v1';
const STATIC_CACHE = 'baraaka-static-v1';
const DYNAMIC_CACHE = 'baraaka-dynamic-v1';

// Ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/transactions',
  '/categories',
  '/login',
  '/register',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Mise en cache des ressources statiques');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes API (toujours réseau)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Vous êtes hors ligne' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // Pour les pages et ressources statiques : Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache la réponse réussie
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(async () => {
        // En cas d'échec réseau, chercher dans le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Page hors ligne par défaut pour les navigations
        if (request.mode === 'navigate') {
          const offlineResponse = await caches.match('/');
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        return new Response('Contenu non disponible hors ligne', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});

// Gestion des notifications push (optionnel)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nouvelle notification de Baraaka',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard',
      },
      actions: [
        { action: 'open', title: 'Ouvrir' },
        { action: 'close', title: 'Fermer' },
      ],
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'Baraaka', options)
    );
  }
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Synchronisation en arrière-plan (optionnel)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    console.log('[SW] Synchronisation des transactions...');
    // Logique de synchronisation à implémenter si nécessaire
  }
});
