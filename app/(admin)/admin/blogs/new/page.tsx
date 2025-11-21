import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlogForm from '@/components/admin/blogs/BlogForm';
// import BlogForm from '@/components/admin/blogs/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish a new blog article
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
