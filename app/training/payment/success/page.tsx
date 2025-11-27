import { completePayment } from '@/actions/payment-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/trainings');
  }

  // Verify and complete the payment
  const result = await completePayment(sessionId);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for your purchase. Your training enrollment has been confirmed.
          </p>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <strong>What's next?</strong>
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Check your email for enrollment confirmation</li>
              <li>Access training materials in your account</li>
              <li>Join the training session on the scheduled date</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/trainings">
                Browse More Trainings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Receipt and invoice will be sent to your email
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
