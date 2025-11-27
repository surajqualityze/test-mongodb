import Stripe from 'stripe';
import { getDatabase } from './mongodb';
import type { StripeConfig } from '@/types/payment';

// Get Stripe configuration
export async function getStripeConfig(): Promise<StripeConfig | null> {
  try {
    const db = await getDatabase();
    const config = await db.collection('stripe_config').findOne({});
    return config as StripeConfig | null;
  } catch (error) {
    console.error('Get Stripe config error:', error);
    return null;
  }
}

// Initialize Stripe client
export async function getStripeClient(): Promise<Stripe | null> {
  try {
    const config = await getStripeConfig();
    
    if (!config || !config.enabled) {
      console.error('Stripe not configured or disabled');
      return null;
    }

    const stripe = new Stripe(config.secretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    return stripe;
  } catch (error) {
    console.error('Initialize Stripe error:', error);
    return null;
  }
}

// Create checkout session
export async function createCheckoutSession(
  trainingId: string,
  trainingTitle: string,
  amount: number,
  currency: string,
  userEmail: string,
  userName: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  try {
    const stripe = await getStripeClient();
    
    if (!stripe) {
      return { success: false, error: 'Stripe not configured' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: trainingTitle,
              description: `Training: ${trainingTitle}`,
            },
            unit_amount: amount, // Amount in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        trainingId,
        userName,
        ...metadata,
      },
    });

    return { 
      success: true, 
      sessionId: session.id,
      url: session.url 
    };
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return { success: false, error: error.message };
  }
}

// Verify payment
export async function verifyPayment(sessionId: string) {
  try {
    const stripe = await getStripeClient();
    
    if (!stripe) {
      return { success: false, error: 'Stripe not configured' };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        metadata: session.metadata,
      },
    };
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return { success: false, error: error.message };
  }
}

// Process refund
export async function processRefund(paymentIntentId: string, amount?: number) {
  try {
    const stripe = await getStripeClient();
    
    if (!stripe) {
      return { success: false, error: 'Stripe not configured' };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // Optional: partial refund
    });

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    };
  } catch (error: any) {
    console.error('Process refund error:', error);
    return { success: false, error: error.message };
  }
}
