import { ObjectId } from 'mongodb';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'paypal' | 'razorpay';

export interface Payment {
  _id?: ObjectId;
  
  // Training Info
  trainingId: string;
  trainingTitle: string;
  trainingType: string;
  trainingDate?: Date;
  
  // Pricing
  amount: number; // in cents/paise
  currency: string; // USD, INR, etc
  discountApplied?: number;
  finalAmount: number;
  
  // User Info
  userEmail: string;
  userName: string;
  userPhone?: string;
  userCompany?: string;
  
  // Payment Details
  paymentProvider: PaymentProvider;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string; // Stripe payment intent ID
  sessionId?: string; // Stripe checkout session ID
  transactionId?: string;
  
  // Metadata
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  
  // Timestamps
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeConfig {
  _id?: ObjectId;
  publishableKey: string;
  secretKey: string;
  webhookSecret?: string;
  currency: string;
  enabled: boolean;
  testMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckoutSessionParams {
  trainingId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  userCompany?: string;
  successUrl: string;
  cancelUrl: string;
}
