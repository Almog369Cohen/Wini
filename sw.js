// Wini Service Worker - for background notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/Wini/');
      }
    })
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/Wini/icons/icon-192x192.png',
      badge: '/Wini/icons/icon-72x72.png',
      tag: `wini-${Date.now()}`,
      requireInteraction: false,
    });
  }
});
