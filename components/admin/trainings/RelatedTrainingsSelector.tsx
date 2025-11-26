'use client';

import { useEffect, useState } from 'react';
import { getAllTrainings } from '@/actions/training-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RelatedTrainingsSelectorProps {
  selectedTrainings: string[];
  onChange: (trainings: string[]) => void;
  currentTrainingId?: string;
  disabled?: boolean;
}

interface TrainingOption {
  _id: string;
  title: string;
  type: string;
}

export default function RelatedTrainingsSelector({
  selectedTrainings,
  onChange,
  currentTrainingId,
  disabled,
}: RelatedTrainingsSelectorProps) {
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainings() {
      setLoading(true);
      const allTrainings = await getAllTrainings();
      
      // Filter out current training and only show published
      const filtered = allTrainings
        .filter((t: any) => 
          t.status === 'published' && 
          (!currentTrainingId || t._id !== currentTrainingId)
        )
        .map((t: any) => ({
          _id: t._id,
          title: t.title,
          type: t.type,
        }));
      
      setTrainings(filtered);
      setLoading(false);
    }
    fetchTrainings();
  }, [currentTrainingId]);

  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (trainingId: string) => {
    if (selectedTrainings.includes(trainingId)) {
      onChange(selectedTrainings.filter((id) => id !== trainingId));
    } else {
      onChange([...selectedTrainings, trainingId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Trainings</CardTitle>
        <CardDescription>
          Select up to 3 related trainings to display
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            disabled={disabled || loading}
          />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading trainings...</p>
        ) : filteredTrainings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published trainings found</p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {filteredTrainings.map((training) => (
              <div key={training._id} className="flex items-start space-x-3">
                <Checkbox
                  id={training._id}
                  checked={selectedTrainings.includes(training._id)}
                  onCheckedChange={() => handleToggle(training._id)}
                  disabled={
                    disabled ||
                    (selectedTrainings.length >= 3 && !selectedTrainings.includes(training._id))
                  }
                />
                <Label
                  htmlFor={training._id}
                  className="text-sm font-normal leading-tight cursor-pointer flex-1"
                >
                  <div>{training.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{training.type}</div>
                </Label>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {selectedTrainings.length}/3 trainings selected
        </p>
      </CardContent>
    </Card>
  );
}
