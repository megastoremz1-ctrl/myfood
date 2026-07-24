'use client';

import { useState, useEffect } from 'react';
import { Bell, Package, Tag, Info, Check, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getUserNotifications, markNotificationAsRead } from '@/lib/db';
import { useAuth } from '@/components/auth/AuthProvider';

const typeIcons: Record<string, any> = {
  order: Package,
  promo: Tag,
  system: Info,
};

const typeColors: Record<string, string> = {
  order: 'bg-blue-50 text-blue-500',
  promo: 'bg-primary-50 text-primary-500',
  system: 'bg-gray-50 text-gray-500',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications: storeNotifications, markNotificationRead } = useStore();
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        const notifs = await getUserNotifications();
        setDbNotifications(notifs);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  // Use DB notifications if available, fallback to store
  const notifications = dbNotifications.length > 0
    ? dbNotifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleDateString('pt-BR'),
        read: n.read,
        type: n.type || 'system',
      }))
    : storeNotifications;

  const handleMarkRead = async (id: string) => {
    if (dbNotifications.length > 0) {
      await markNotificationAsRead(id);
      setDbNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } else {
      markNotificationRead(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notificacoes</h1>
          <p className="text-sm text-gray-500">{notifications.filter((n: any) => !n.read).length} nao lidas</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Sem notificacoes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: any) => {
            const Icon = typeIcons[notif.type] || Info;
            const colorClass = typeColors[notif.type] || typeColors.system;
            return (
              <button
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`w-full card p-4 flex items-start gap-3 text-left transition-colors ${
                  !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900' : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <Check className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
