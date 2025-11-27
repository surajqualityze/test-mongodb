'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveEmailConfig, testEmailConfig } from '@/actions/email-actions';
import { Loader2, Save, Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { EmailConfig, EmailProvider } from '@/types/email';

interface EmailConfigFormProps {
  initialConfig?: Partial<EmailConfig>;
}

const DEFAULT_WHITEPAPER_TEMPLATE = {
  subject: 'Your Whitepaper: {{whitepaperTitle}}',
  htmlBody: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi {{userName}},</h2>
      <p>Thank you for your interest in our whitepaper!</p>
      <p>You can download <strong>{{whitepaperTitle}}</strong> using the link below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{downloadLink}}" 
           style="background-color: #007bff; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Download Whitepaper
        </a>
      </p>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Best regards,<br>{{companyName}} Team</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        © {{year}} {{companyName}}. All rights reserved.
      </p>
    </div>
  `,
  textBody: `
Hi {{userName}},

Thank you for your interest in our whitepaper!

You can download {{whitepaperTitle}} using this link:
{{downloadLink}}

If you have any questions, feel free to reach out to us.

Best regards,
{{companyName}} Team

© {{year}} {{companyName}}. All rights reserved.
  `,
  attachPDF: false,
};

export default function EmailConfigForm({ initialConfig }: EmailConfigFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const [config, setConfig] = useState<Partial<EmailConfig>>({
    provider: initialConfig?.provider || 'resend',
    apiKey: initialConfig?.apiKey || '',
    fromEmail: initialConfig?.fromEmail || '',
    fromName: initialConfig?.fromName || '',
    replyTo: initialConfig?.replyTo || '',
    enableAutoSend: initialConfig?.enableAutoSend ?? true,
    enableRetry: initialConfig?.enableRetry ?? true,
    maxRetries: initialConfig?.maxRetries || 3,
    retryDelay: initialConfig?.retryDelay || 300,
    testMode: initialConfig?.testMode ?? false,
    testEmail: initialConfig?.testEmail || '',
    smtpHost: initialConfig?.smtpHost || '',
    smtpPort: initialConfig?.smtpPort || 587,
    smtpUser: initialConfig?.smtpUser || '',
    smtpPassword: initialConfig?.smtpPassword || '',
    smtpSecure: initialConfig?.smtpSecure ?? false,
    templates: {
      whitepaper: initialConfig?.templates?.whitepaper || DEFAULT_WHITEPAPER_TEMPLATE,
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await saveEmailConfig(config);

    if (result.success) {
      setSuccess('Email configuration saved successfully!');
      router.refresh();
    } else {
      setError(result.error || 'Failed to save configuration');
    }

    setLoading(false);
  }

  async function handleTestEmail() {
    if (!testEmail) {
      setError('Please enter a test email address');
      return;
    }

    setTestLoading(true);
    setError('');
    setSuccess('');

    const result = await testEmailConfig(testEmail);

    if (result.success) {
      setSuccess(`Test email sent successfully to ${testEmail}!`);
    } else {
      setError(result.error || 'Failed to send test email');
    }

    setTestLoading(false);
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
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="provider" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="provider">Provider Settings</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="test">Test & Logs</TabsTrigger>
        </TabsList>

        {/* Provider Settings Tab */}
        <TabsContent value="provider" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider</CardTitle>
              <CardDescription>
                Choose and configure your email service provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Select
                  value={config.provider}
                  onValueChange={(value: EmailProvider) =>
                    setConfig({ ...config, provider: value })
                  }
                >
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="aws-ses">AWS SES</SelectItem>
                    <SelectItem value="smtp">Custom SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.provider !== 'smtp' && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from your email provider's dashboard
                  </p>
                </div>
              )}

              {config.provider === 'smtp' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host *</Label>
                      <Input
                        id="smtpHost"
                        value={config.smtpHost}
                        onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port *</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={config.smtpPort}
                        onChange={(e) =>
                          setConfig({ ...config, smtpPort: parseInt(e.target.value) })
                        }
                        placeholder="587"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username *</Label>
                      <Input
                        id="smtpUser"
                        value={config.smtpUser}
                        onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password *</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={config.smtpPassword}
                        onChange={(e) =>
                          setConfig({ ...config, smtpPassword: e.target.value })
                        }
                        placeholder="password"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smtpSecure"
                      checked={config.smtpSecure}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, smtpSecure: checked as boolean })
                      }
                    />
                    <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
              <CardDescription>Configure who emails are sent from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email *</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={config.fromEmail}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  placeholder="noreply@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">From Name *</Label>
                <Input
                  id="fromName"
                  value={config.fromName}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  placeholder="Qualityze"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email *</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={config.replyTo}
                  onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
                  placeholder="support@example.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableAutoSend"
                  checked={config.enableAutoSend}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, enableAutoSend: checked as boolean })
                  }
                />
                <Label htmlFor="enableAutoSend">Enable automatic email sending</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableRetry"
                  checked={config.enableRetry}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, enableRetry: checked as boolean })
                  }
                />
                <Label htmlFor="enableRetry">Enable retry on failure</Label>
              </div>

              {config.enableRetry && (
                <div className="grid gap-4 md:grid-cols-2 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Max Retries</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      value={config.maxRetries}
                      onChange={(e) =>
                        setConfig({ ...config, maxRetries: parseInt(e.target.value) })
                      }
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retryDelay">Retry Delay (seconds)</Label>
                    <Input
                      id="retryDelay"
                      type="number"
                      value={config.retryDelay}
                      onChange={(e) =>
                        setConfig({ ...config, retryDelay: parseInt(e.target.value) })
                      }
                      min="60"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="testMode"
                  checked={config.testMode}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, testMode: checked as boolean })
                  }
                />
                <Label htmlFor="testMode">Test Mode (send all emails to test address)</Label>
              </div>

              {config.testMode && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="testEmailConfig">Test Email Address</Label>
                  <Input
                    id="testEmailConfig"
                    type="email"
                    value={config.testEmail}
                    onChange={(e) => setConfig({ ...config, testEmail: e.target.value })}
                    placeholder="test@example.com"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Whitepaper Download Email</CardTitle>
              <CardDescription>
                Customize the email sent when users download whitepapers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={config.templates?.whitepaper?.subject || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      templates: {
                        ...config.templates,
                        whitepaper: {
                          ...config.templates?.whitepaper!,
                          subject: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Your Whitepaper: {{whitepaperTitle}}"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {'{'}userName{'}'}, {'{'}whitepaperTitle{'}'}, {'{'}
                  companyName{'}'}, {'{'}year{'}'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="htmlBody">HTML Body *</Label>
                <Textarea
                  id="htmlBody"
                  value={config.templates?.whitepaper?.htmlBody || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      templates: {
                        ...config.templates,
                        whitepaper: {
                          ...config.templates?.whitepaper!,
                          htmlBody: e.target.value,
                        },
                      },
                    })
                  }
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textBody">Plain Text Body *</Label>
                <Textarea
                  id="textBody"
                  value={config.templates?.whitepaper?.textBody || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      templates: {
                        ...config.templates,
                        whitepaper: {
                          ...config.templates?.whitepaper!,
                          textBody: e.target.value,
                        },
                      },
                    })
                  }
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test & Logs Tab */}
        <TabsContent value="test" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Configuration</CardTitle>
              <CardDescription>
                Send a test email to verify your configuration is working
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <Button
                type="button"
                onClick={handleTestEmail}
                disabled={testLoading || !testEmail}
              >
                {testLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Make sure to save your configuration before sending a
              test email. The test email will use your current saved settings.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </form>
  );
}
