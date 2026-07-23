/**
 * OneSignal Web SDK Integration for MyFood
 * 
 * App ID: 44064aa0-829e-4485-9326-32f7c695f6f7
 * Uses the OneSignal Web SDK loaded via script tag (official recommended approach)
 * Documentation: https://documentation.onesignal.com/docs/en/web-sdk-setup
 */

const ONESIGNAL_APP_ID = '44064aa0-829e-4485-9326-32f7c695f6f7';

let initialized = false;
let sdkLoaded = false;

// Type for the global OneSignalDeferred array and SDK
declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
    OneSignal?: any;
  }
}

/**
 * Load the OneSignal SDK script
 */
function loadOneSignalScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (sdkLoaded || document.getElementById('onesignal-sdk')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'onesignal-sdk';
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    script.onload = () => {
      sdkLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load OneSignal SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Execute a command through the OneSignal SDK
 */
function oneSignalDeferred(callback: (OneSignal: any) => void): void {
  if (typeof window === 'undefined') return;
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(callback);
}

/**
 * Initialize the OneSignal Web SDK
 */
export async function initOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (initialized) return;

  try {
    await loadOneSignalScript();

    oneSignalDeferred((OneSignal) => {
      OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerParam: {
          scope: '/push/onesignal/',
        },
        serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
      });
    });

    initialized = true;
    console.log('[OneSignal] SDK initialized successfully');

    // Set up push subscription observer
    setupPushSubscriptionObserver();
  } catch (error) {
    console.error('[OneSignal] Initialization error:', error);
  }
}

/**
 * Push Subscription Verification Observer
 */
let verificationDialogShown = false;

function isRegistered(subscriptionId: string | null | undefined): boolean {
  return !!subscriptionId && !subscriptionId.startsWith('local-');
}

function maybeShowVerificationDialog(subscriptionId: string | null | undefined): void {
  if (isRegistered(subscriptionId) && !verificationDialogShown) {
    // Check localStorage so it only shows once ever
    if (localStorage.getItem('onesignal-verified') === 'true') return;
    verificationDialogShown = true;
    localStorage.setItem('onesignal-verified', 'true');
    showVerificationDialog();
  }
}

function setupPushSubscriptionObserver(): void {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    // Listen for subscription changes
    OneSignal.User.PushSubscription.addEventListener('change', (event: any) => {
      maybeShowVerificationDialog(event?.current?.id);
    });

    // Check current subscription immediately
    const currentId = OneSignal.User.PushSubscription.id;
    maybeShowVerificationDialog(currentId);
  });
}

function showVerificationDialog(): void {
  const dialog = document.createElement('div');
  dialog.id = 'onesignal-verification-dialog';
  dialog.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px;">
      <div style="background:white;border-radius:16px;padding:32px;max-width:400px;width:100%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
        <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:8px;">Your OneSignal SDK integration is complete!</h2>
        <p style="font-size:14px;color:#6b7280;line-height:1.5;margin-bottom:24px;">You can now send Push Notifications & In-App Messages through OneSignal. Tap below to enable push notifications.</p>
        <button id="onesignal-verify-btn" style="width:100%;padding:14px;background:#f97316;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">Got it</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById('onesignal-verify-btn')?.addEventListener('click', () => {
    dialog.remove();
    requestOneSignalPermission();
  });
}

/**
 * Request notification permission
 */
export async function requestOneSignalPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    oneSignalDeferred((OneSignal) => {
      OneSignal.Notifications.requestPermission().then(() => {
        const permission = OneSignal.Notifications.permission;
        console.log('[OneSignal] Permission:', permission);
        resolve(permission);
      }).catch(() => resolve(false));
    });
  });
}

/**
 * Get the current push subscription ID
 */
export async function getOneSignalPlayerId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    oneSignalDeferred((OneSignal) => {
      resolve(OneSignal.User.PushSubscription.id || null);
    });
  });
}

/**
 * Set External User ID
 */
export async function setOneSignalExternalUserId(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    OneSignal.login(userId);
    console.log('[OneSignal] External user ID set:', userId);
  });
}

/**
 * Logout user
 */
export async function logoutOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    OneSignal.logout();
    console.log('[OneSignal] User logged out');
  });
}

/**
 * Add tags for segmentation
 */
export async function setOneSignalTags(tags: Record<string, string>): Promise<void> {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    OneSignal.User.addTags(tags);
    console.log('[OneSignal] Tags set:', tags);
  });
}

/**
 * Add email subscription
 */
export async function addOneSignalEmail(email: string): Promise<void> {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    OneSignal.User.addEmail(email);
    console.log('[OneSignal] Email added:', email);
  });
}

/**
 * Add SMS subscription
 */
export async function addOneSignalSms(phone: string): Promise<void> {
  if (typeof window === 'undefined') return;

  oneSignalDeferred((OneSignal) => {
    OneSignal.User.addSms(phone);
    console.log('[OneSignal] SMS added:', phone);
  });
}

/**
 * Send notification via server-side API route
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
