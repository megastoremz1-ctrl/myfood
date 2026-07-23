import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: POST /api/notifications/send
 * 
 * Proxies notification requests to OneSignal REST API.
 * This keeps the REST API Key server-side only (secure).
 */

const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
const ONESIGNAL_APP_ID = '44064aa0-829e-4485-9326-32f7c695f6f7';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Ensure app_id is set
    body.app_id = ONESIGNAL_APP_ID;

    if (!ONESIGNAL_REST_API_KEY) {
      return NextResponse.json(
        { error: 'OneSignal REST API Key not configured. Set ONESIGNAL_REST_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'OneSignal API error', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API] Notification send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
