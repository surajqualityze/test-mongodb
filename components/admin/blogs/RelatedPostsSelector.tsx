'use client';

import { useEffect, useState } from 'react';
import { getPublishedBlogs } from '@/actions/blog-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RelatedPostsSelectorProps {
  selectedPosts: string[];
  onChange: (posts: string[]) => void;
  currentBlogId?: string;
  disabled?: boolean;
}

interface BlogOption {
  _id: string;
  title: string;
  slug: string;
}

export default function RelatedPostsSelector({
  selectedPosts,
  onChange,
  currentBlogId,
  disabled,
}: RelatedPostsSelectorProps) {
  const [blogs, setBlogs] = useState<BlogOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const publishedBlogs = await getPublishedBlogs(currentBlogId);
      setBlogs(publishedBlogs);
      setLoading(false);
    }
    fetchBlogs();
  }, [currentBlogId]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (blogId: string) => {
    if (selectedPosts.includes(blogId)) {
      onChange(selectedPosts.filter((id) => id !== blogId));
    } else {
      onChange([...selectedPosts, blogId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Posts</CardTitle>
        <CardDescription>
          Select up to 3 related blog posts to display
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            disabled={disabled || loading}
          />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading posts...</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published posts found</p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="flex items-start space-x-3">
                <Checkbox
                  id={blog._id}
                  checked={selectedPosts.includes(blog._id)}
                  onCheckedChange={() => handleToggle(blog._id)}
                  disabled={
                    disabled ||
                    (selectedPosts.length >= 3 && !selectedPosts.includes(blog._id))
                  }
                />
                <Label
                  htmlFor={blog._id}
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  {blog.title}
                </Label>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {selectedPosts.length}/3 posts selected
        </p>
      </CardContent>
    </Card>
  );
}
