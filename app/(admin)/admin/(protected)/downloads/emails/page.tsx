import { getEmailConfig } from '@/actions/email-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EmailConfigForm from '@/components/admin/downloads/EmailConfigForm';

export default async function EmailManagementPage() {
  const config = await getEmailConfig();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/downloads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Configure email settings and templates for automatic delivery
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailConfigForm initialConfig={config || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
