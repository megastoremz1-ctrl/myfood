'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { initNotifications, requestNotificationPermission, onNotificationReceived, showLocalNotification } from '@/lib/notifications';

export default function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    // Initialize notification system
    initNotifications();

    // Check if already has permission
    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      setPermissionGranted(true);
    } else if (Notification.permission === 'default') {
      // Show banner after 10 seconds if no decision yet
      const dismissed = localStorage.getItem('myfood-notif-banner-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowBanner(true), 10000);
        return () => clearTimeout(timer);
      }
    }

    // Listen for foreground notifications
    const unsubscribe = onNotificationReceived((payload) => {
      setToast({ title: payload.title, body: payload.body });
      showLocalNotification(payload);
      setTimeout(() => setToast(null), 5000);
    });

    return unsubscribe;
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    if (result.granted) {
      setPermissionGranted(true);
      setShowBanner(false);
      // Save token to your backend here
      console.log('Push token:', result.token);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('myfood-notif-banner-dismissed', 'true');
  };

  return (
    <>
      {/* Permission Request Banner */}
      {showBanner && !permissionGranted && (
        <div className="fixed top-16 left-4 right-4 z-[55] max-w-md mx-auto animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">Activar notificacoes?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receba alertas sobre o estado dos seus pedidos e promocoes exclusivas
                </p>
              </div>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnable}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" /> Activar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors"
              >
                Agora nao
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-app Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] max-w-sm animate-slide-up">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{toast.body}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
