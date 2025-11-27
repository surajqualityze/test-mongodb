'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createWhitepaper, updateWhitepaper } from '@/actions/whitepaper-actions';
import { Loader2, Save, Plus, X } from 'lucide-react';
import type { WhitepaperFormData } from '@/types/whitepaper';

interface WhitepaperFormProps {
  initialData?: Partial<WhitepaperFormData>;
  whitepaperId?: string;
}

const CATEGORIES = [
  'Finance',
  'Healthcare',
  'Technology',
  'Manufacturing',
  'Education',
  'Legal',
  'Human Resources',
  'Marketing',
  'Sales',
  'Operations',
];

export default function WhitepaperForm({ initialData, whitepaperId }: WhitepaperFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState<WhitepaperFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    industries: initialData?.industries || [],
    summary: initialData?.summary || '',
    highlights: initialData?.highlights || [],
    coverImage: initialData?.coverImage || '',
    pdfUrl: initialData?.pdfUrl || '',
    fileSize: initialData?.fileSize || '',
    pageCount: initialData?.pageCount || 0,
    author: initialData?.author || '',
    authorTitle: initialData?.authorTitle || '',
    publishDate: initialData?.publishDate || new Date(),
    status: initialData?.status || 'draft',
    scheduledDate: initialData?.scheduledDate,
    featured: initialData?.featured || false,
    seo: initialData?.seo || {},
  });

  const [industriesInput, setIndustriesInput] = useState(
    initialData?.industries?.join(', ') || ''
  );

  const [newHighlight, setNewHighlight] = useState('');

  function handleChange(e: any) {
    const { name, value, type } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
    
    // Auto-generate slug from title
    if (name === 'title' && !whitepaperId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  }

  function handleIndustriesChange(value: string) {
    setIndustriesInput(value);
    const industries = value
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    setForm(prev => ({ ...prev, industries }));
  }

  function addHighlight() {
    if (newHighlight.trim()) {
      setForm(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  }

  function removeHighlight(index: number) {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (whitepaperId) {
        result = await updateWhitepaper(whitepaperId, form);
      } else {
        result = await createWhitepaper(form);
      }

      if (result.success) {
        if (whitepaperId) {
          router.push(`/admin/whitepapers/${whitepaperId}`);
        } else if (result.whitepaperId) {
          router.push(`/admin/whitepapers/${result.whitepaperId}`);
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
                {whitepaperId ? 'Update Whitepaper' : 'Create Whitepaper'}
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

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Primary details about the whitepaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter whitepaper title"
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
                  placeholder="whitepaper-url-slug"
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
                  placeholder="Brief description of the whitepaper"
                  rows={3}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={form.category} 
                    onValueChange={(value) => setForm(f => ({ ...f, category: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industries">Industries</Label>
                  <Input
                    id="industries"
                    value={industriesInput}
                    onChange={(e) => handleIndustriesChange(e.target.value)}
                    placeholder="Banking, Healthcare, Tech"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate with commas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Detailed content information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Executive summary or overview"
                  rows={4}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Key Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a key takeaway"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addHighlight}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.highlights.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {form.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{highlight}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(index)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File & Media */}
          <Card>
            <CardHeader>
              <CardTitle>Files & Media</CardTitle>
              <CardDescription>Upload PDF and cover image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfUrl">PDF URL *</Label>
                <Input
                  id="pdfUrl"
                  name="pdfUrl"
                  value={form.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/whitepaper.pdf"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your PDF to Cloudinary/S3 and paste the URL here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fileSize">File Size</Label>
                  <Input
                    id="fileSize"
                    name="fileSize"
                    value={form.fileSize}
                    onChange={handleChange}
                    placeholder="2.5 MB"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageCount">Page Count</Label>
                  <Input
                    id="pageCount"
                    name="pageCount"
                    type="number"
                    value={form.pageCount}
                    onChange={handleChange}
                    placeholder="15"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorTitle">Author Title</Label>
                  <Input
                    id="authorTitle"
                    name="authorTitle"
                    value={form.authorTitle}
                    onChange={handleChange}
                    placeholder="Senior Analyst"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date *</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={form.publishDate ? new Date(form.publishDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setForm(f => ({ ...f, publishDate: new Date(e.target.value) }))}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Settings Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={form.status} 
                    onValueChange={(value: any) => setForm(f => ({ ...f, status: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.status === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="datetime-local"
                      value={form.scheduledDate ? new Date(form.scheduledDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setForm(f => ({ ...f, scheduledDate: e.target.value ? new Date(e.target.value) : undefined }))}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm(f => ({ ...f, featured: checked as boolean }))}
                  disabled={loading}
                />
                <Label htmlFor="featured">Featured Whitepaper</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
