'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveStripeConfig } from '@/actions/payment-actions';
import { Loader2, Save, AlertCircle, ExternalLink } from 'lucide-react';
import type { StripeConfig } from '@/types/payment';

interface StripeConfigFormProps {
  initialConfig?: Partial<StripeConfig>;
}

export default function StripeConfigForm({ initialConfig }: StripeConfigFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [config, setConfig] = useState<Partial<StripeConfig>>({
    publishableKey: initialConfig?.publishableKey || '',
    secretKey: initialConfig?.secretKey || '',
    webhookSecret: initialConfig?.webhookSecret || '',
    currency: initialConfig?.currency || 'usd',
    enabled: initialConfig?.enabled ?? true,
    testMode: initialConfig?.testMode ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await saveStripeConfig(config);

    if (result.success) {
      setSuccess('Stripe configuration saved successfully!');
      router.refresh();
    } else {
      setError(result.error || 'Failed to save configuration');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Get Stripe Keys
        </Button>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe API Keys</CardTitle>
          <CardDescription>
            Get your API keys from the Stripe Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publishableKey">Publishable Key *</Label>
            <Input
              id="publishableKey"
              value={config.publishableKey}
              onChange={(e) => setConfig({ ...config, publishableKey: e.target.value })}
              placeholder="pk_test_..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Used on the client-side for Stripe.js
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              value={config.secretKey}
              onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
              placeholder="sk_test_..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Used on the server-side for API calls
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              value={config.webhookSecret}
              onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
              placeholder="whsec_..."
            />
            <p className="text-xs text-muted-foreground">
              For verifying webhook signatures (recommended for production)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Select
              value={config.currency}
              onValueChange={(value) => setConfig({ ...config, currency: value })}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
                <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enabled"
              checked={config.enabled}
              onCheckedChange={(checked) =>
                setConfig({ ...config, enabled: checked as boolean })
              }
            />
            <Label htmlFor="enabled">Enable Stripe payments</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="testMode"
              checked={config.testMode}
              onCheckedChange={(checked) =>
                setConfig({ ...config, testMode: checked as boolean })
              }
            />
            <Label htmlFor="testMode">Test mode (use test keys)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Setup Instructions:</strong>
          <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm">
            <li>Create a Stripe account at stripe.com</li>
            <li>Get your API keys from the Stripe Dashboard</li>
            <li>Use test keys for development (pk_test_... and sk_test_...)</li>
            <li>Use live keys for production (pk_live_... and sk_live_...)</li>
            <li>Configure your webhook endpoint for payment notifications</li>
          </ol>
        </AlertDescription>
      </Alert>
    </form>
  );
}
