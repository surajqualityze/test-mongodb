import { getAllTrainings } from '@/actions/training-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TrainingsDataTable from '@/components/admin/trainings/TrainingsDataTable';
import type { Training } from '@/types/training';

async function getTrainings() {
  const trainings = await getAllTrainings();
  return trainings as (Training & { _id: string })[];
}

export default async function TrainingsPage() {
  const trainings = await getTrainings();

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

      <TrainingsDataTable trainings={trainings} />
    </div>
  );
}
