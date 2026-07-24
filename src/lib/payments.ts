/**
 * MyFood Payment Service - PaySuite Integration
 * 
 * Integrates with PaySuite (paysuite.co.mz) for:
 * - M-Pesa payments
 * - e-Mola payments
 * - Credit/Debit card payments
 * - Refunds
 * - Payouts to restaurants and drivers
 * 
 * API Docs: https://docs.paysuite.co.mz
 * Base URL: https://paysuite.tech/api/v1
 */

export type PaymentMethod = 'mpesa' | 'emola' | 'credit_card' | 'wallet' | 'cash';

export interface PaymentRequest {
  amount: number;
  reference: string;
  description: string;
  method?: PaymentMethod;
  returnUrl?: string;
  callbackUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  status?: string;
  error?: string;
}

export interface PayoutRequest {
  amount: number;
  method: 'mpesa' | 'emola' | 'bank';
  beneficiary: {
    phone?: string;
    holder: string;
    bank?: string;
    account?: string;
  };
  reference: string;
  description?: string;
}

/**
 * Create a payment request via PaySuite
 * Called server-side via API route
 */
export async function createPayment(data: PaymentRequest): Promise<PaymentResult> {
  try {
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Erro no pagamento' };
    }

    return {
      success: true,
      paymentId: result.data?.id,
      checkoutUrl: result.data?.checkout_url,
      status: result.data?.status,
    };
  } catch (error) {
    return { success: false, error: 'Erro de conexao. Tente novamente.' };
  }
}

/**
 * Check payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<{
  status: string;
  paid: boolean;
  transactionId?: string;
}> {
  try {
    const response = await fetch(`/api/payments/status?id=${paymentId}`);
    const result = await response.json();

    return {
      status: result.data?.status || 'unknown',
      paid: result.data?.status === 'paid',
      transactionId: result.data?.transaction?.transaction_id,
    };
  } catch {
    return { status: 'error', paid: false };
  }
}

/**
 * Request a refund
 */
export async function requestRefund(paymentId: string, amount: number, reason: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, amount, reason }),
    });

    const result = await response.json();
    return { success: response.ok, error: result.message };
  } catch {
    return { success: false, error: 'Erro ao processar reembolso' };
  }
}

/**
 * Create payout to restaurant or driver
 */
export async function createPayout(data: PayoutRequest): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/payments/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return { success: response.ok, error: result.message };
  } catch {
    return { success: false, error: 'Erro ao processar pagamento' };
  }
}
