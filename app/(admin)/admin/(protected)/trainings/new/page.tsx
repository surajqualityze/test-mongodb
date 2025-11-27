import TrainingForm from '@/components/admin/trainings/TrainingForm';

export default function NewTrainingPage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-xl font-bold mb-6">Create New Training</h2>
      <TrainingForm />
    </div>
  );
}
