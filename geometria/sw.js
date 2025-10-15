// ========== SERVICE WORKER - GEOMETRÍA INTERACTIVA meskeIA ==========
// PWA Service Worker para funcionalidad offline

const CACHE_NAME = 'geometria-meskeia-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Archivos a cachear para funcionamiento offline
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',

  // CDN resources (Chart.js)
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

// ========== INSTALACIÓN ==========
self.addEventListener('install', function(event) {
  console.log('📦 Service Worker: Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Service Worker: Archivos almacenados en caché');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('❌ Error al cachear archivos:', error);
      })
  );
});

// ========== ACTIVACIÓN ==========
self.addEventListener('activate', function(event) {
  console.log('🚀 Service Worker: Activando...');

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Eliminar cachés antiguos
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ========== INTERCEPCIÓN DE PETICIONES ==========
self.addEventListener('fetch', function(event) {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si existe en caché, devolverlo
        if (response) {
          console.log('📱 Sirviendo desde caché:', event.request.url);
          return response;
        }

        // Si no existe, obtener de la red
        return fetch(event.request)
          .then(function(response) {
            // Verificar que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachearla
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Solo cachear recursos de la misma origin o CDN específicos
                if (event.request.url.startsWith(self.location.origin) ||
                    event.request.url.includes('cdn.jsdelivr.net/npm/chart.js')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(function(error) {
            console.log('🌐 Error de red, sirviendo página offline:', error);

            // Si es una navegación, servir página offline
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            // Para otros recursos, retornar error
            throw error;
          });
      })
  );
});

// ========== MANEJO DE MENSAJES ==========
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Service Worker: Saltando espera...');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cache: CACHE_NAME
    });
  }
});

// ========== ACTUALIZACIONES EN BACKGROUND ==========
self.addEventListener('backgroundsync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('🔄 Sincronización en segundo plano');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementar lógica de sincronización si es necesaria
  return Promise.resolve();
}

// ========== NOTIFICACIONES PUSH ==========
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'Nueva actualización disponible',
      tag: 'geometria-update',
      renotify: true,
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'dismiss',
          title: 'Cerrar'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Geometría meskeIA', options)
    );
  }
});

// ========== CLICK EN NOTIFICACIÓN ==========
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('./')
    );
  } else if (event.action === 'dismiss') {
    // Solo cerrar la notificación
    return;
  } else {
    // Click en el cuerpo de la notificación
    event.waitUntil(
      clients.matchAll().then(function(clientList) {
        // Si ya hay una ventana abierta, enfocarla
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }

        // Si no hay ventanas abiertas, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
    );
  }
});

// ========== INFORMACIÓN DEL SERVICE WORKER ==========
console.log(`
🎯 Geometría Interactiva meskeIA - Service Worker v${CACHE_VERSION}
📱 PWA preparada para uso offline
🔄 Caché: ${CACHE_NAME}
📦 Archivos cacheados: ${urlsToCache.length}
`);

// ========== ESTRATEGIAS DE CACHÉ ==========

// Cache First (para recursos estáticos)
function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      return response || fetch(request)
        .then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return fetchResponse;
        });
    });
}

// Network First (para contenido dinámico)
function networkFirst(request) {
  return fetch(request)
    .then(response => {
      const responseClone = response.clone();
      caches.open(CACHE_NAME)
        .then(cache => cache.put(request, responseClone));
      return response;
    })
    .catch(() => caches.match(request));
}

// Stale While Revalidate (para equilibrio)
function staleWhileRevalidate(request) {
  const fetchPromise = fetch(request)
    .then(response => {
      const responseClone = response.clone();
      caches.open(CACHE_NAME)
        .then(cache => cache.put(request, responseClone));
      return response;
    });

  return caches.match(request)
    .then(response => response || fetchPromise)
    .catch(() => fetchPromise);
}