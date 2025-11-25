import { getSpeaker } from '@/actions/speaker-actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';

export default async function SpeakerDetailPage({
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
          <Link href="/admin/speakers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{speaker.name}</h1>
          <p className="text-muted-foreground">{speaker.expertise}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/speakers/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{speaker.years}</span>
            <p className="text-xs text-muted-foreground">Years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{speaker.trainings?.length || 0}</span>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{speaker.industries.length}</span>
            <p className="text-xs text-muted-foreground">Covered</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{speaker.bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {speaker.industries.map((industry) => (
              <Badge key={industry} variant="secondary">
                {industry}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {speaker.trainings && speaker.trainings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trainings by {speaker.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {speaker.trainings.map((training: any) => (
                <li key={training._id} className="flex items-center justify-between">
                  <Link
                    href={`/admin/trainings/${training._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {training.title}
                  </Link>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {training.type}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {training.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
