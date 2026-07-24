/**
 * MyFood Notification Service
 * 
 * Unified notification system that supports both FCM and OneSignal.
 * Configure which provider to use via environment variables.
 * 
 * Provider: Set NEXT_PUBLIC_NOTIFICATION_PROVIDER to 'fcm' or 'onesignal'
 */

import { requestFCMPermission, onForegroundMessage } from './firebase';
import {
  initOneSignal,
  requestOneSignalPermission,
  getOneSignalPlayerId,
  setOneSignalExternalUserId,
  setOneSignalTags,
  sendOneSignalNotification,
} from './onesignal';

export type NotificationProvider = 'fcm' | 'onesignal' | 'both';

const PROVIDER: NotificationProvider =
  (process.env.NEXT_PUBLIC_NOTIFICATION_PROVIDER as NotificationProvider) || 'onesignal';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, string>;
}

/**
 * Initialize the notification system
 */
export async function initNotifications(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (PROVIDER === 'onesignal' || PROVIDER === 'both') {
    await initOneSignal();
  }

  console.log(`[MyFood Notifications] Initialized with provider: ${PROVIDER}`);
}

/**
 * Request permission to send push notifications
 */
export async function requestNotificationPermission(): Promise<{
  granted: boolean;
  token?: string | null;
}> {
  if (typeof window === 'undefined') return { granted: false };

  if (PROVIDER === 'fcm' || PROVIDER === 'both') {
    const fcmToken = await requestFCMPermission();
    if (fcmToken) {
      return { granted: true, token: fcmToken };
    }
  }

  if (PROVIDER === 'onesignal' || PROVIDER === 'both') {
    const granted = await requestOneSignalPermission();
    const playerId = granted ? await getOneSignalPlayerId() : null;
    return { granted, token: playerId };
  }

  return { granted: false };
}

/**
 * Set user identity for targeted notifications
 */
export async function setUserIdentity(userId: string, role: 'client' | 'business' | 'driver'): Promise<void> {
  if (typeof window === 'undefined') return;

  if (PROVIDER === 'onesignal' || PROVIDER === 'both') {
    await setOneSignalExternalUserId(userId);
    await setOneSignalTags({
      user_role: role,
      user_id: userId,
    });
  }

  console.log(`[MyFood Notifications] User identity set: ${userId} (${role})`);
}

/**
 * Listen for foreground notifications
 */
export function onNotificationReceived(
  callback: (payload: NotificationPayload) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  if (PROVIDER === 'fcm' || PROVIDER === 'both') {
    return onForegroundMessage((payload) => {
      callback({
        title: payload.notification?.title || 'MyFood',
        body: payload.notification?.body || '',
        icon: payload.notification?.icon,
        data: payload.data,
      });
    });
  }

  // OneSignal handles foreground display automatically
  return () => {};
}

/**
 * Send notification (admin/server usage)
 * In production, this should be done server-side
 */
export async function sendNotification(options: {
  title: string;
  message: string;
  targetType: 'all' | 'clients' | 'restaurants' | 'drivers' | 'specific';
  targetIds?: string[];
  url?: string;
}): Promise<boolean> {
  if (PROVIDER === 'onesignal' || PROVIDER === 'both') {
    let segments: string[] | undefined;
    let tags: { key: string; value: string }[] | undefined;
    let playerIds: string[] | undefined;

    switch (options.targetType) {
      case 'all':
        segments = ['All'];
        break;
      case 'clients':
        tags = [{ key: 'user_role', value: 'client' }];
        break;
      case 'restaurants':
        tags = [{ key: 'user_role', value: 'business' }];
        break;
      case 'drivers':
        tags = [{ key: 'user_role', value: 'driver' }];
        break;
      case 'specific':
        playerIds = options.targetIds;
        break;
    }

    return sendOneSignalNotification({
      title: options.title,
      message: options.message,
      playerIds,
      segments,
      tags,
      url: options.url,
    });
  }

  // FCM requires server-side sending (Firebase Admin SDK)
  console.log('[MyFood Notifications] FCM send requires server-side implementation');
  return false;
}

/**
 * Show a local notification (browser Notification API)
 */
export function showLocalNotification(payload: NotificationPayload): void {
  if (typeof window === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    data: payload.data,
  });

  notification.onclick = () => {
    if (payload.url) {
      window.open(payload.url, '_blank');
    }
    notification.close();
  };
}
