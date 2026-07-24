import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * POST /api/payments/webhook
 * Receives payment status updates from PaySuite
 * 
 * Events: payment.success, payment.failed
 */

const PAYSUITE_WEBHOOK_SECRET = process.env.PAYSUITE_WEBHOOK_SECRET || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('X-Webhook-Signature') || '';

    // Verify webhook signature
    if (PAYSUITE_WEBHOOK_SECRET) {
      const calculatedSignature = crypto
        .createHmac('sha256', PAYSUITE_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      if (signature !== calculatedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(payload);
    const event = data.event;
    const paymentData = data.data;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    if (event === 'payment.success') {
      // Update order payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', paymentData.reference);

      // Record transaction
      const { data: order } = await supabase
        .from('orders')
        .select('customer_id, restaurant_id, total')
        .eq('id', paymentData.reference)
        .single();

      if (order) {
        await supabase.from('transactions').insert({
          user_id: order.customer_id,
          order_id: paymentData.reference,
          type: 'order_payment',
          amount: paymentData.amount,
          status: 'completed',
          description: `Pagamento pedido via ${paymentData.transaction?.method || 'paysuite'}`,
        });
      }
    }

    if (event === 'payment.failed') {
      await supabase
        .from('orders')
        .update({ payment_status: 'pending', status: 'pending' })
        .eq('id', paymentData.reference);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
