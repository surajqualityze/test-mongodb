import { getTraining } from '@/actions/training-actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Edit, ArrowLeft, Eye, Calendar, Clock, DollarSign } from 'lucide-react';

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await params first
  const training = await getTraining(id);

  if (!training) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/trainings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{training.title}</h1>
          <p className="text-muted-foreground">{training.description}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/trainings/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="capitalize">
              {training.status}
            </Badge>
            {training.featured && (
              <Badge variant="secondary" className="ml-2">
                ⭐ Featured
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold">{training.duration}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Level</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-bold capitalize">{training.level}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold">${training.regularPrice}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Content</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{training.content}</p>
          </div>

          {training.whoShouldAttend && (
            <div>
              <h3 className="font-semibold mb-2">Who Should Attend</h3>
              <p className="text-muted-foreground">{training.whoShouldAttend}</p>
            </div>
          )}

          {training.overview && (
            <div>
              <h3 className="font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">{training.overview}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Slug</p>
            <p className="text-sm text-muted-foreground">{training.slug}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Speaker</p>
            <p className="text-sm text-muted-foreground">{training.speakerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Industry</p>
            <p className="text-sm text-muted-foreground">{training.industry}</p>
          </div>
          {training.subIndustry && (
            <div>
              <p className="text-sm font-medium">Sub Industry</p>
              <p className="text-sm text-muted-foreground">{training.subIndustry}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground capitalize">{training.type}</p>
          </div>
          {training.date && (
            <div>
              <p className="text-sm font-medium">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {new Date(training.date).toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {training.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm text-muted-foreground">
              {new Date(training.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm text-muted-foreground">
              {new Date(training.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
