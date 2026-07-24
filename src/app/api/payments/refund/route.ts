import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/refund
 * Create refund via PaySuite
 */

const PAYSUITE_API_URL = 'https://paysuite.tech/api/v1';
const PAYSUITE_TOKEN = process.env.PAYSUITE_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount, reason } = await request.json();

    if (!paymentId || !amount || !reason) {
      return NextResponse.json({ status: 'error', message: 'All fields required' }, { status: 400 });
    }

    const response = await fetch(`${PAYSUITE_API_URL}/refunds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSUITE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        amount: parseFloat(amount).toFixed(2),
        reason,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 'error', message: 'Refund failed' }, { status: 500 });
  }
}
