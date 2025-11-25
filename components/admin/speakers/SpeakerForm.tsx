'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createSpeaker, updateSpeaker } from '@/actions/speaker-actions';
import { Loader2, Save } from 'lucide-react';

interface SpeakerFormProps {
  initialData?: {
    name: string;
    photoUrl?: string;
    expertise: string;
    years: number;
    industries: string[];
    bio: string;
  };
  speakerId?: string;
}

export default function SpeakerForm({ initialData, speakerId }: SpeakerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: initialData?.name || '',
    photoUrl: initialData?.photoUrl || '',
    expertise: initialData?.expertise || '',
    years: initialData?.years || 0,
    industries: initialData?.industries || [],
    bio: initialData?.bio || '',
  });

  const [industriesInput, setIndustriesInput] = useState(
    initialData?.industries?.join(', ') || ''
  );

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'years' ? Number(value) : value }));
  }

  function handleIndustriesChange(value: string) {
    setIndustriesInput(value);
    const industries = value
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);
    setForm(prev => ({ ...prev, industries }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (speakerId) {
        result = await updateSpeaker(speakerId, form);
      } else {
        result = await createSpeaker(form);
      }

      if (result.success) {
        if (speakerId) {
          router.push(`/admin/speakers/${speakerId}`);
        } else if (result.speakerId) {
          router.push(`/admin/speakers/${result.speakerId}`);
        }
        router.refresh();
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action buttons at top */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {speakerId ? 'Update Speaker' : 'Create Speaker'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Speaker Name *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            name="photoUrl"
            value={form.photoUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">Area of Expertise *</Label>
          <Input
            id="expertise"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            placeholder="Credit Analysis, Lending"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Years of Experience *</Label>
          <Input
            id="years"
            name="years"
            type="number"
            value={form.years}
            onChange={handleChange}
            placeholder="10"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industries">Industries *</Label>
          <Input
            id="industries"
            value={industriesInput}
            onChange={(e) => handleIndustriesChange(e.target.value)}
            placeholder="Banking & Insurance, Healthcare"
            required
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            Separate industries with commas
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biography *</Label>
          <Textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Speaker biography and background..."
            rows={6}
            required
            disabled={loading}
          />
        </div>
      </div>
    </form>
  );
}
