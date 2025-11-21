'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogSEO } from '@/types/blog';

interface SEOFieldsProps {
  seo: BlogSEO;
  onChange: (seo: BlogSEO) => void;
  disabled?: boolean;
}

export default function SEOFields({ seo, onChange, disabled }: SEOFieldsProps) {
  const handleChange = (field: keyof BlogSEO, value: string) => {
    onChange({ ...seo, [field]: value });
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    onChange({ ...seo, metaKeywords: keywords });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>
          Optimize your blog post for search engines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={seo.metaTitle || ''}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            placeholder="SEO-friendly title (50-60 characters)"
            disabled={disabled}
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">
            {seo.metaTitle?.length || 0}/60 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={seo.metaDescription || ''}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            placeholder="Brief description for search results (150-160 characters)"
            rows={3}
            disabled={disabled}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {seo.metaDescription?.length || 0}/160 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Meta Keywords</Label>
          <Input
            id="metaKeywords"
            value={seo.metaKeywords?.join(', ') || ''}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Separate keywords with commas
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">Canonical URL</Label>
          <Input
            id="canonicalUrl"
            value={seo.canonicalUrl || ''}
            onChange={(e) => handleChange('canonicalUrl', e.target.value)}
            placeholder="https://example.com/blog/post-slug"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Specify the preferred URL for this content
          </p>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-4">Open Graph (Social Media)</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                value={seo.ogTitle || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                placeholder="Title for social media sharing"
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={seo.ogDescription || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                placeholder="Description for social media sharing"
                rows={2}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                value={seo.ogImage || ''}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x630px
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
