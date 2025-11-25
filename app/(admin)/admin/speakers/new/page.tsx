import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpeakerForm from '@/components/admin/speakers/SpeakerForm';

export default function NewSpeakerPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Speaker</h1>
        <p className="text-muted-foreground">
          Add a new speaker/instructor profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Speaker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SpeakerForm />
        </CardContent>
      </Card>
    </div>
  );
}
