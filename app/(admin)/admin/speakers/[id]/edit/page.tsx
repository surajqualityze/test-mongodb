import { getSpeaker } from '@/actions/speaker-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpeakerForm from '@/components/admin/speakers/SpeakerForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditSpeakerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const speaker = await getSpeaker(id);

  if (!speaker) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/speakers/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Speaker</h1>
          <p className="text-muted-foreground">
            Update speaker details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Speaker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SpeakerForm
            initialData={{
              name: speaker.name,
              photoUrl: speaker.photoUrl,
              expertise: speaker.expertise,
              years: speaker.years,
              industries: speaker.industries,
              bio: speaker.bio,
            }}
            speakerId={id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
