import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/payments/status?id=xxx
 * Check payment status via PaySuite API
 */

const PAYSUITE_API_URL = 'https://paysuite.tech/api/v1';
const PAYSUITE_TOKEN = process.env.PAYSUITE_API_TOKEN || '';

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get('id');

  if (!paymentId) {
    return NextResponse.json({ status: 'error', message: 'Payment ID required' }, { status: 400 });
  }

  if (!PAYSUITE_TOKEN) {
    return NextResponse.json({ status: 'error', message: 'API token not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${PAYSUITE_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${PAYSUITE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 'error', message: 'Failed to check status' }, { status: 500 });
  }
}
