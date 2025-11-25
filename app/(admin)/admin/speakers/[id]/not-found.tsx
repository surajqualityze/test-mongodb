import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SpeakerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-2xl font-bold">Speaker Not Found</h2>
      <p className="text-muted-foreground">
        The speaker you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/admin/speakers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Speakers
        </Link>
      </Button>
    </div>
  );
}
