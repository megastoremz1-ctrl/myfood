import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/create
 * Creates a payment request via PaySuite API
 */

const PAYSUITE_API_URL = 'https://paysuite.tech/api/v1';
const PAYSUITE_TOKEN = process.env.PAYSUITE_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, reference, description, method, returnUrl, callbackUrl } = body;

    if (!amount || !reference) {
      return NextResponse.json({ status: 'error', message: 'Amount and reference required' }, { status: 400 });
    }

    if (!PAYSUITE_TOKEN) {
      return NextResponse.json(
        { status: 'error', message: 'PaySuite API token not configured. Set PAYSUITE_API_TOKEN in .env.local' },
        { status: 500 }
      );
    }

    const paymentData: Record<string, any> = {
      amount: parseFloat(amount).toFixed(2),
      reference,
      description: description || `Pagamento MyFood - ${reference}`,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cliente/rastreamento`,
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/webhook`,
    };

    if (method && method !== 'wallet' && method !== 'cash') {
      paymentData.method = method;
    }

    const response = await fetch(`${PAYSUITE_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSUITE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: result.message || 'Payment creation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}
