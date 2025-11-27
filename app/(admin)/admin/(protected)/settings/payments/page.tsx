import { getStripeConfig } from '@/actions/payment-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StripeConfigForm from '@/components/admin/payments/StripeConfigForm';

export default async function PaymentSettingsPage() {
  const config = await getStripeConfig();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground">
            Configure Stripe payment gateway for training purchases
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <StripeConfigForm initialConfig={config || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
