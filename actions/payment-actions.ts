'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { createCheckoutSession, verifyPayment, processRefund } from '@/lib/stripe';
import type { Payment, StripeConfig, CreateCheckoutSessionParams } from '@/types/payment';

// Get Stripe configuration
export async function getStripeConfig() {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    const db = await getDatabase();
    const config = await db.collection('stripe_config').findOne({});
    
    if (!config) {
      return null;
    }

    // Don't send secret keys to client
    return {
      ...config,
      _id: config._id.toString(),
      secretKey: '••••••••',
      webhookSecret: config.webhookSecret ? '••••••••' : undefined,
    };
  } catch (error) {
    console.error('Get Stripe config error:', error);
    return null;
  }
}

// Save Stripe configuration
export async function saveStripeConfig(config: Partial<StripeConfig>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const existing = await db.collection('stripe_config').findOne({});
    
    const configData = {
      ...config,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.collection('stripe_config').updateOne(
        { _id: existing._id },
        { $set: configData }
      );
    } else {
      await db.collection('stripe_config').insertOne({
        ...configData,
        createdAt: new Date(),
      });
    }

    revalidatePath('/admin/settings/payments');
    return { success: true };
  } catch (error: any) {
    console.error('Save Stripe config error:', error);
    return { success: false, error: error.message };
  }
}

// Create payment checkout session
export async function createTrainingCheckout(params: CreateCheckoutSessionParams) {
  try {
    const db = await getDatabase();
    
    // Get training details
    const training = await db.collection('trainings').findOne({ 
      _id: new ObjectId(params.trainingId) 
    });
    
    if (!training) {
      return { success: false, error: 'Training not found' };
    }

    if (training.status !== 'published') {
      return { success: false, error: 'Training not available' };
    }

    // Calculate amount
    const amount = training.discountPrice 
      ? training.discountPrice * 100 // Convert to cents
      : training.regularPrice * 100;

    // Get Stripe config for currency
    const stripeConfig = await db.collection('stripe_config').findOne({});
    const currency = stripeConfig?.currency || 'usd';

    // Create checkout session
    const result = await createCheckoutSession(
      params.trainingId,
      training.title,
      amount,
      currency,
      params.userEmail,
      params.userName,
      params.successUrl,
      params.cancelUrl,
      {
        userPhone: params.userPhone || '',
        userCompany: params.userCompany || '',
      }
    );

    if (!result.success) {
      return result;
    }

    // Create payment record
    const payment: Omit<Payment, '_id'> = {
      trainingId: params.trainingId,
      trainingTitle: training.title,
      trainingType: training.type,
      trainingDate: training.date,
      amount: training.discountPrice || training.regularPrice,
      currency: currency.toUpperCase(),
      discountApplied: training.discountPrice ? training.regularPrice - training.discountPrice : undefined,
      finalAmount: training.discountPrice || training.regularPrice,
      userEmail: params.userEmail,
      userName: params.userName,
      userPhone: params.userPhone,
      userCompany: params.userCompany,
      paymentProvider: 'stripe',
      paymentStatus: 'pending',
      sessionId: result.sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('payments').insertOne(payment);

    revalidatePath('/admin/payments');
    
    return {
      success: true,
      sessionId: result.sessionId,
      url: result.url,
    };
  } catch (error: any) {
    console.error('Create checkout error:', error);
    return { success: false, error: error.message };
  }
}

// Verify and complete payment
export async function completePayment(sessionId: string) {
  try {
    const db = await getDatabase();
    
    // Verify payment with Stripe
    const verification = await verifyPayment(sessionId);
    
    if (!verification.success) {
      return verification;
    }

    const session = verification.session;

    // Update payment record
    const updateData: any = {
      paymentStatus: session.paymentStatus === 'paid' ? 'completed' : 'failed',
      paymentIntentId: session.id,
      updatedAt: new Date(),
    };

    if (session.paymentStatus === 'paid') {
      updateData.paidAt = new Date();
    }

    await db.collection('payments').updateOne(
      { sessionId: sessionId },
      { $set: updateData }
    );

    revalidatePath('/admin/payments');
    
    return {
      success: true,
      paymentStatus: session.paymentStatus,
    };
  } catch (error: any) {
    console.error('Complete payment error:', error);
    return { success: false, error: error.message };
  }
}

// Get all payments
export async function getAllPayments(filters?: {
  status?: string;
  trainingId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return [];
    }

    const db = await getDatabase();
    const query: any = {};

    if (filters?.status && filters.status !== 'all') {
      query.paymentStatus = filters.status;
    }

    if (filters?.trainingId) {
      query.trainingId = filters.trainingId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        query.createdAt.$lte = filters.dateTo;
      }
    }

    const payments = await db
      .collection('payments')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return payments.map(p => ({
      ...p,
      _id: p._id.toString(),
    }));
  } catch (error) {
    console.error('Get payments error:', error);
    return [];
  }
}

// Get payment by ID
export async function getPayment(id: string) {
  try {
    const db = await getDatabase();
    const payment = await db.collection('payments').findOne({ _id: new ObjectId(id) });
    
    if (!payment) {
      return null;
    }

    return {
      ...payment,
      _id: payment._id.toString(),
    };
  } catch (error) {
    console.error('Get payment error:', error);
    return null;
  }
}

// Refund payment
export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });
    
    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    if (payment.paymentStatus !== 'completed') {
      return { success: false, error: 'Can only refund completed payments' };
    }

    if (!payment.paymentIntentId) {
      return { success: false, error: 'No payment intent ID found' };
    }

    // Process refund with Stripe
    const refundAmount = amount ? amount * 100 : undefined; // Convert to cents if partial
    const result = await processRefund(payment.paymentIntentId, refundAmount);

    if (!result.success) {
      return result;
    }

    // Update payment record
    await db.collection('payments').updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          paymentStatus: 'refunded',
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    revalidatePath('/admin/payments');
    
    return { success: true };
  } catch (error: any) {
    console.error('Refund payment error:', error);
    return { success: false, error: error.message };
  }
}

// Get payment statistics
export async function getPaymentStats() {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    const db = await getDatabase();
    
    const [totalPayments, completedPayments, totalRevenue, recentPayments] = await Promise.all([
      db.collection('payments').countDocuments(),
      db.collection('payments').countDocuments({ paymentStatus: 'completed' }),
      db.collection('payments').aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } },
      ]).toArray(),
      db.collection('payments')
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments: totalPayments - completedPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentPayments: recentPayments.map(p => ({
        ...p,
        _id: p._id.toString(),
      })),
    };
  } catch (error) {
    console.error('Get payment stats error:', error);
    return null;
  }
}
