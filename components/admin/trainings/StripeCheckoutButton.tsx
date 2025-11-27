'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createTrainingCheckout } from '@/actions/payment-actions';
import { Loader2, CreditCard } from 'lucide-react';

interface StripeCheckoutButtonProps {
  trainingId: string;
  trainingTitle: string;
  amount: number;
  currency?: string;
}

export default function StripeCheckoutButton({
  trainingId,
  trainingTitle,
  amount,
  currency = 'USD',
}: StripeCheckoutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createTrainingCheckout({
        trainingId,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        userCompany: formData.company,
        successUrl: `${window.location.origin}/training/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/training/${trainingId}?payment=cancelled`,
      });

      if (result.success && result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError(result.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <CreditCard className="mr-2 h-5 w-5" />
          Enroll Now - {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(amount)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Enrollment</DialogTitle>
          <DialogDescription>
            Enter your details to proceed to secure payment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCheckout} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="ABC Corp"
              disabled={loading}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Training:</span>
              <span className="text-sm">{trainingTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount:</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency,
                }).format(amount)}
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe. Your payment information is encrypted and secure.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
