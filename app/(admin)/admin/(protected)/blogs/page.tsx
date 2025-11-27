import { getDatabase } from '@/lib/mongodb';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BlogsDataTable from '@/components/admin/blogs/BlogsDataTable';
import type { Blog } from '@/types/blog';

async function getBlogs() {
  const db = await getDatabase();
  const blogs = await db
    .collection('blogs')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return blogs.map((blog) => ({
    ...blog,
    _id: blog._id.toString(),
  })) as (Blog & { _id: string })[];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </div>

      <BlogsDataTable blogs={blogs} />
    </div>
  );
}
