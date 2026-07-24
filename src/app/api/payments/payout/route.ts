import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/payout
 * Create payout to restaurant or driver via PaySuite
 */

const PAYSUITE_API_URL = 'https://paysuite.tech/api/v1';
const PAYSUITE_TOKEN = process.env.PAYSUITE_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const { amount, method, beneficiary, reference, description } = await request.json();

    if (!amount || !method || !beneficiary) {
      return NextResponse.json({ status: 'error', message: 'All fields required' }, { status: 400 });
    }

    const response = await fetch(`${PAYSUITE_API_URL}/payouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSUITE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount).toFixed(2),
        method,
        beneficiary,
        reference: reference || `PO-${Date.now()}`,
        description: description || 'Payout MyFood',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 'error', message: 'Payout failed' }, { status: 500 });
  }
}
