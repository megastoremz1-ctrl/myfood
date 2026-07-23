/**
 * OneSignal Web SDK Integration for MyFood
 * 
 * App ID: 44064aa0-829e-4485-9326-32f7c695f6f7
 * Documentation: https://documentation.onesignal.com/docs/en/web-sdk-setup
 * 
 * All OneSignal interactions are centralized in this module.
 */

const ONESIGNAL_APP_ID = '44064aa0-829e-4485-9326-32f7c695f6f7';

let initialized = false;

/**
 * Initialize the OneSignal Web SDK
 * Called once on app load
 */
export async function initOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (initialized) return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;

    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerParam: {
        scope: '/push/onesignal/',
      },
      serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
    });

    initialized = true;
    console.log('[OneSignal] SDK initialized successfully');

    // Set up push subscription observer for verification
    setupPushSubscriptionObserver();
  } catch (error) {
    console.error('[OneSignal] Initialization error:', error);
  }
}

/**
 * Push Subscription Verification Observer
 * Shows a dialog once when a real server-assigned subscription ID is received
 */
let verificationDialogShown = false;

function isRegistered(subscriptionId: string | null | undefined): boolean {
  return !!subscriptionId && !subscriptionId.startsWith('local-');
}

function maybeShowVerificationDialog(subscriptionId: string | null | undefined): void {
  if (isRegistered(subscriptionId) && !verificationDialogShown) {
    verificationDialogShown = true;
    showVerificationDialog();
  }
}

async function setupPushSubscriptionObserver(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;

    // Listen for subscription changes
    OneSignal.User.PushSubscription.addEventListener('change', (event: any) => {
      const currentId = event?.current?.id;
      maybeShowVerificationDialog(currentId);
    });

    // Check current subscription ID immediately
    const currentId = OneSignal.User.PushSubscription.id;
    maybeShowVerificationDialog(currentId);
  } catch (error) {
    console.error('[OneSignal] Subscription observer error:', error);
  }
}

function showVerificationDialog(): void {
  // Show verification dialog in the browser
  const dialog = document.createElement('div');
  dialog.id = 'onesignal-verification-dialog';
  dialog.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px;">
      <div style="background:white;border-radius:16px;padding:32px;max-width:400px;width:100%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
        <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:8px;">Your OneSignal SDK integration is complete!</h2>
        <p style="font-size:14px;color:#6b7280;line-height:1.5;margin-bottom:24px;">You can now send Push Notifications & In-App Messages through OneSignal. Tap below to enable push notifications.</p>
        <button id="onesignal-verify-btn" style="width:100%;padding:14px;background:#f97316;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:background 0.2s;">Got it</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById('onesignal-verify-btn')?.addEventListener('click', async () => {
    dialog.remove();
    await requestOneSignalPermission();
  });
}

/**
 * Request notification permission
 */
export async function requestOneSignalPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.Notifications.requestPermission();
    const permission = await OneSignal.Notifications.permission;
    console.log('[OneSignal] Permission:', permission);
    return permission;
  } catch (error) {
    console.error('[OneSignal] Permission request error:', error);
    return false;
  }
}

/**
 * Get the current push subscription ID (Player ID)
 */
export async function getOneSignalPlayerId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    const id = OneSignal.User.PushSubscription.id;
    return id || null;
  } catch (error) {
    console.error('[OneSignal] Error getting player ID:', error);
    return null;
  }
}

/**
 * Set External User ID for cross-platform identification
 */
export async function setOneSignalExternalUserId(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.login(userId);
    console.log('[OneSignal] External user ID set:', userId);
  } catch (error) {
    console.error('[OneSignal] Error setting external user ID:', error);
  }
}

/**
 * Logout user (clear external user ID)
 */
export async function logoutOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.logout();
    console.log('[OneSignal] User logged out');
  } catch (error) {
    console.error('[OneSignal] Logout error:', error);
  }
}

/**
 * Add tags for segmentation (e.g., user role, preferences)
 */
export async function setOneSignalTags(tags: Record<string, string>): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.User.addTags(tags);
    console.log('[OneSignal] Tags set:', tags);
  } catch (error) {
    console.error('[OneSignal] Error setting tags:', error);
  }
}

/**
 * Add email subscription
 */
export async function addOneSignalEmail(email: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.User.addEmail(email);
    console.log('[OneSignal] Email added:', email);
  } catch (error) {
    console.error('[OneSignal] Error adding email:', error);
  }
}

/**
 * Add SMS subscription
 */
export async function addOneSignalSms(phone: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignalModule = await import('react-onesignal');
    const OneSignal = OneSignalModule.default;
    await OneSignal.User.addSms(phone);
    console.log('[OneSignal] SMS added:', phone);
  } catch (error) {
    console.error('[OneSignal] Error adding SMS:', error);
  }
}

/**
 * Send notification via OneSignal REST API
 * In production, this should be done server-side via API routes
 */
export async function sendOneSignalNotification(options: {
  title: string;
  message: string;
  playerIds?: string[];
  segments?: string[];
  tags?: { key: string; value: string }[];
  url?: string;
}): Promise<boolean> {
  const body: Record<string, any> = {
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
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log('[OneSignal] Notification sent:', data);
    return response.ok;
  } catch (error) {
    console.error('[OneSignal] Error sending notification:', error);
    return false;
  }
}
