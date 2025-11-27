import { getAllTrainings } from '@/actions/training-actions';
import { getAllSpeakers } from '@/actions/speaker-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TrainingsDataTable from '@/components/admin/trainings/TrainingsDataTable';
import TrainingFilters from '@/components/admin/trainings/TrainingFilters';
import type { Training } from '@/types/training';

async function getTrainings() {
  const trainings = await getAllTrainings();
  return trainings as (Training & { _id: string })[];
}

async function getSpeakers() {
  return await getAllSpeakers();
}

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const trainings = await getTrainings();
  const speakers = await getSpeakers();

  // Apply filters
  let filteredTrainings = trainings;

  // Filter by speaker (skip if 'all' or empty)
  if (params.speaker && params.speaker !== 'all') {
    filteredTrainings = filteredTrainings.filter(
      (t) => t.speakerId === params.speaker
    );
  }

  // Filter by type (skip if 'all' or empty)
  if (params.type && params.type !== 'all') {
    filteredTrainings = filteredTrainings.filter(
      (t) => t.type === params.type
    );
  }

  // Filter by level (skip if 'all' or empty)
  if (params.level && params.level !== 'all') {
    filteredTrainings = filteredTrainings.filter(
      (t) => t.level === params.level
    );
  }

  // Filter by status (skip if 'all' or empty)
  if (params.status && params.status !== 'all') {
    filteredTrainings = filteredTrainings.filter(
      (t) => t.status === params.status
    );
  }

  // Filter by industry (partial match)
  if (params.industry && params.industry !== 'all') {
    filteredTrainings = filteredTrainings.filter(
      (t) => t.industry.toLowerCase().includes((params.industry as string).toLowerCase())
    );
  }

  // Filter by search term
  if (params.search) {
    const searchTerm = (params.search as string).toLowerCase();
    filteredTrainings = filteredTrainings.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
          <p className="text-muted-foreground">
            Manage your training sessions and webinars
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/trainings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Training
          </Link>
        </Button>
      </div>

      <TrainingFilters speakers={speakers} />
      <TrainingsDataTable trainings={filteredTrainings} />
    </div>
  );
}
