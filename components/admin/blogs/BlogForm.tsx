'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, updateBlog } from '@/actions/blog-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import type { BlogFormData, BlogSEO } from '@/types/blog';
import dynamic from 'next/dynamic';
import SEOFields from './SEOFields';
import RelatedPostsSelector from './RelatedPostsSelector';

const RichTextEditor = dynamic(
  () => import('./RichTextEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }
);

interface BlogFormProps {
  initialData?: BlogFormData;
  blogId?: string;
}

export default function BlogForm({ initialData, blogId }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    coverImage: initialData?.coverImage || '',
    seo: initialData?.seo || {},
    relatedPosts: initialData?.relatedPosts || [],
  });

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(', ') || ''
  );

  const handleChange = (
    field: keyof BlogFormData,
    value: string | boolean | string[] | BlogSEO
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'title' && !blogId) {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (blogId) {
        result = await updateBlog(blogId, formData);
      } else {
        result = await createBlog(formData);
      }

      if (result.success) {
        if (blogId) {
          router.push(`/admin/blogs/${blogId}`);
        } else if (result.blogId) {
          router.push(`/admin/blogs/${result.blogId}`);
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Action buttons at the top */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {blogId ? 'Update Blog' : 'Create Blog'}
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
        
        {/* Status indicator */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Status: <span className="font-medium capitalize">{formData.status}</span>
          </div>
          {formData.featured && (
            <div className="text-sm text-muted-foreground">
              ⭐ Featured
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="related">Related Posts</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter blog title"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="blog-post-url"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief description of the blog post"
              rows={3}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleChange('content', content)}
              placeholder="Write your blog content here..."
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="technology, tutorial, nextjs"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => handleChange('status', value)}
                disabled={loading}
              >
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
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  handleChange('featured', checked as boolean)
                }
                disabled={loading}
              />
              <Label htmlFor="featured">Featured post</Label>
            </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="mt-6">
          <SEOFields
            seo={formData.seo || {}}
            onChange={(seo) => handleChange('seo', seo)}
            disabled={loading}
          />
        </TabsContent>

        {/* Related Posts Tab */}
        <TabsContent value="related" className="mt-6">
          <RelatedPostsSelector
            selectedPosts={formData.relatedPosts || []}
            onChange={(posts) => handleChange('relatedPosts', posts)}
            currentBlogId={blogId}
            disabled={loading}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
}
