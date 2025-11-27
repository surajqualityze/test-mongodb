import { getAllSpeakers } from '@/actions/speaker-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SpeakersDataTable from '@/components/admin/speakers/SpeakersDataTable';

async function getSpeakers() {
  return await getAllSpeakers();
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Speakers</h1>
          <p className="text-muted-foreground">
            Manage your training speakers and instructors
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/speakers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Speaker
          </Link>
        </Button>
      </div>

      <SpeakersDataTable speakers={speakers} />
    </div>
  );
}
