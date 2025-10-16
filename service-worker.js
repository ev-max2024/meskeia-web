// Service Worker meskeIA - DESACTIVADO TEMPORALMENTE
// Este Service Worker se desregistra automáticamente para evitar problemas

// Instalación - Desregistrar inmediatamente
self.addEventListener('install', event => {
  console.log('[SW] Desinstalando Service Worker...');
  self.skipWaiting();
});

// Activación - Limpiar todas las cachés y desactivar
self.addEventListener('activate', event => {
  console.log('[SW] Limpiando cachés y desactivando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('[SW] Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker desactivado. Recarga la página.');
      return self.clients.claim();
    })
  );
});

// NO interceptar ninguna petición - dejar que el navegador maneje todo
self.addEventListener('fetch', event => {
  // No hacer nada - dejar pasar todas las peticiones sin interceptar
  return;
});