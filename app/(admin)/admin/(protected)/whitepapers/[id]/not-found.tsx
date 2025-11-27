import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function WhitepaperNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-2xl font-bold">Whitepaper Not Found</h2>
      <p className="text-muted-foreground">
        The whitepaper you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/admin/whitepapers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Whitepapers
        </Link>
      </Button>
    </div>
  );
}
