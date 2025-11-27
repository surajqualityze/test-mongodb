import { getTraining } from '@/actions/training-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrainingForm from '@/components/admin/trainings/TrainingForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditTrainingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const training = await getTraining(id);

  if (!training) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/trainings/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Training</h1>
          <p className="text-muted-foreground">
            Update training details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingForm
            initialData={{
              title: training.title,
              slug: training.slug,
              description: training.description,
              content: training.content,
              duration: training.duration,
              level: training.level,
              type: training.type,
              date: training.date,
              industry: training.industry,
              subIndustry: training.subIndustry,
              tags: training.tags,
              speakerId: training.speakerId,
              coverImage: training.coverImage,
              pricingOptions: training.pricingOptions,
              regularPrice: training.regularPrice,
              discountPrice: training.discountPrice,
              whoShouldAttend: training.whoShouldAttend,
              overview: training.overview,
              status: training.status,
              featured: training.featured,
              seo: training.seo,
              relatedTrainings: training.relatedTrainings,
            }}
            trainingId={id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
