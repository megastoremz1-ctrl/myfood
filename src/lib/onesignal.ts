// OneSignal Web Push Integration
// Documentation: https://documentation.onesignal.com/docs/react-js-setup

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'YOUR_ONESIGNAL_APP_ID';

// Initialize OneSignal
export async function initOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Dynamic import to avoid SSR issues
  const OneSignal = (await import('react-onesignal')).default;

  try {
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true, // For development
      serviceWorkerParam: {
        scope: '/push/onesignal/',
      },
      serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
    });

    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.error('OneSignal initialization error:', error);
  }
}

// Request notification permission via OneSignal
export async function requestOneSignalPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.Notifications.requestPermission();

    const permission = await OneSignal.Notifications.permission;
    console.log('OneSignal permission:', permission);
    return permission;
  } catch (error) {
    console.error('OneSignal permission error:', error);
    return false;
  }
}

// Get OneSignal Player ID (subscription ID)
export async function getOneSignalPlayerId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const OneSignal = (await import('react-onesignal')).default;
    const subscriptionId = await OneSignal.User.PushSubscription.id;
    console.log('OneSignal Player ID:', subscriptionId);
    return subscriptionId || null;
  } catch (error) {
    console.error('Error getting OneSignal player ID:', error);
    return null;
  }
}

// Set external user ID for targeting
export async function setOneSignalExternalUserId(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.login(userId);
    console.log('OneSignal external user ID set:', userId);
  } catch (error) {
    console.error('Error setting OneSignal external user ID:', error);
  }
}

// Add tag for segmentation (e.g., role: client, partner, driver)
export async function setOneSignalTags(tags: Record<string, string>): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.User.addTags(tags);
    console.log('OneSignal tags set:', tags);
  } catch (error) {
    console.error('Error setting OneSignal tags:', error);
  }
}

// Send notification via OneSignal REST API (server-side typically, but shown for admin panel demo)
export async function sendOneSignalNotification(options: {
  title: string;
  message: string;
  playerIds?: string[];
  segments?: string[];
  tags?: { key: string; value: string }[];
  url?: string;
}): Promise<boolean> {
  const REST_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY || 'YOUR_REST_API_KEY';

  const body: any = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: options.title },
    contents: { en: options.message },
  };

  if (options.playerIds && options.playerIds.length > 0) {
    body.include_subscription_ids = options.playerIds;
  } else if (options.segments && options.segments.length > 0) {
    body.included_segments = options.segments;
  } else if (options.tags && options.tags.length > 0) {
    body.included_segments = ['All'];
    body.filters = options.tags.map((tag) => ({
      field: 'tag',
      key: tag.key,
      value: tag.value,
    }));
  } else {
    body.included_segments = ['All'];
  }

  if (options.url) {
    body.url = options.url;
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${REST_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('OneSignal notification sent:', data);
    return response.ok;
  } catch (error) {
    console.error('Error sending OneSignal notification:', error);
    return false;
  }
}
