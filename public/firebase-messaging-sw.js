// Firebase Cloud Messaging Service Worker
// This file must be accessible at /firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCctToKhcFqVr8vXlMHJ-zqa2OOzXu2da8",
  authDomain: "myfoodmz.firebaseapp.com",
  projectId: "myfoodmz",
  storageBucket: "myfoodmz.firebasestorage.app",
  messagingSenderId: "224499148683",
  appId: "1:224499148683:web:0ba83f007a35a8b492318e",
  measurementId: "G-FFBVDEG5V7"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'MyFood';
  const notificationOptions = {
    body: payload.notification?.body || 'Tem uma nova notificacao!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      url: payload.data?.url || '/cliente',
      ...payload.data,
    },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'dismiss', title: 'Fechar' },
    ],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/cliente';

  if (event.action === 'dismiss') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(url);
    })
  );
});
