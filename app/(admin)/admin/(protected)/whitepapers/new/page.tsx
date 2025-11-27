import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WhitepaperForm from '@/components/admin/whitepapers/WhitepaperForm';

export default function NewWhitepaperPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Whitepaper</h1>
        <p className="text-muted-foreground">
          Add a new downloadable whitepaper resource
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Whitepaper Details</CardTitle>
        </CardHeader>
        <CardContent>
          <WhitepaperForm />
        </CardContent>
      </Card>
    </div>
  );
}
