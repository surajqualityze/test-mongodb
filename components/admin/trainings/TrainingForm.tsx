'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllSpeakers } from '@/actions/speaker-actions';
import { createTraining, updateTraining } from '@/actions/training-actions';
import { Loader2, Save } from 'lucide-react';
import type { TrainingFormData } from '@/types/training';

interface TrainingFormProps {
  initialData?: Partial<TrainingFormData>;
  trainingId?: string;
}

export default function TrainingForm({ initialData, trainingId }: TrainingFormProps) {
  const router = useRouter();
  const [speakers, setSpeakers] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState<TrainingFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    duration: initialData?.duration || '',
    level: initialData?.level || 'basic',
    type: initialData?.type || 'live',
    date: initialData?.date,
    industry: initialData?.industry || '',
    subIndustry: initialData?.subIndustry || '',
    tags: initialData?.tags || [],
    speakerId: initialData?.speakerId || '',
    coverImage: initialData?.coverImage || '',
    pricingOptions: initialData?.pricingOptions || [],
    regularPrice: initialData?.regularPrice || 0,
    discountPrice: initialData?.discountPrice,
    whoShouldAttend: initialData?.whoShouldAttend || '',
    overview: initialData?.overview || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    seo: initialData?.seo || {},
    relatedTrainings: initialData?.relatedTrainings || [],
  });

  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

  useEffect(() => {
    getAllSpeakers().then(setSpeakers);
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title' && !trainingId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  }

  function handleSpeakerChange(value: string) {
    setForm(prev => ({ ...prev, speakerId: value }));
  }

  function handleTagsChange(value: string) {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setForm(prev => ({ ...prev, tags }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (trainingId) {
        result = await updateTraining(trainingId, form);
      } else {
        result = await createTraining(form);
      }

      if (result.success) {
        if (trainingId) {
          router.push(`/admin/trainings/${trainingId}`);
        } else if (result.trainingId) {
          router.push(`/admin/trainings/${result.trainingId}`);
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
                {trainingId ? 'Update Training' : 'Create Training'}
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
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Status: <span className="font-medium capitalize">{form.status}</span>
          </div>
          {form.featured && (
            <div className="text-sm text-muted-foreground">
              ⭐ Featured
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter training title"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="training-url-slug"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of the training"
            rows={3}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Full Content *</Label>
          <Textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Detailed training content and learning outcomes"
            rows={6}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Speaker & Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Details</h3>

        <div className="space-y-2">
          <Label htmlFor="speakerId">Speaker *</Label>
          <Select value={form.speakerId} onValueChange={handleSpeakerChange} disabled={loading}>
            <SelectTrigger id="speakerId">
              <SelectValue placeholder="Select a speaker" />
            </SelectTrigger>
            <SelectContent>
              {speakers.map(s => (
                <SelectItem value={s._id} key={s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="60 Mins"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={form.level} onValueChange={(value: any) => setForm(f => ({ ...f, level: value }))} disabled={loading}>
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="basic/intermediate">Basic/Intermediate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={form.type} onValueChange={(value: any) => setForm(f => ({ ...f, type: value }))} disabled={loading}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live Webinar</SelectItem>
                <SelectItem value="recorded">Recorded</SelectItem>
                <SelectItem value="on-demand">On-Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="Banking & Insurance"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subIndustry">Sub Industry</Label>
            <Input
              id="subIndustry"
              name="subIndustry"
              value={form.subIndustry}
              onChange={handleChange}
              placeholder="Optional"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="credit, analysis, banking"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date & Time (for live trainings)</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={form.date ? new Date(form.date).toISOString().slice(0, 16) : ''}
            onChange={(e) => setForm(f => ({ ...f, date: e.target.value ? new Date(e.target.value) : undefined }))}
            disabled={loading}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="regularPrice">Regular Price *</Label>
            <Input
              id="regularPrice"
              name="regularPrice"
              type="number"
              value={form.regularPrice}
              onChange={handleChange}
              placeholder="189"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPrice">Discount Price</Label>
            <Input
              id="discountPrice"
              name="discountPrice"
              type="number"
              value={form.discountPrice || ''}
              onChange={handleChange}
              placeholder="Optional"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Status & Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={form.status} onValueChange={(value: any) => setForm(f => ({ ...f, status: value }))} disabled={loading}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => setForm(f => ({ ...f, featured: checked as boolean }))}
              disabled={loading}
            />
            <Label htmlFor="featured">Featured Training</Label>
          </div>
        </div>
      </div>
    </form>
  );
}
