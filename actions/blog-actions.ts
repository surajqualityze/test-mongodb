'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { Blog, BlogFormData } from '@/types/blog';

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Create blog
export async function createBlog(formData: BlogFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    const slug = formData.slug || generateSlug(formData.title);
    
    const existing = await db.collection('blogs').findOne({ slug });
    if (existing) {
      return { success: false, error: 'A blog with this slug already exists' };
    }

    const blog: Omit<Blog, '_id'> = {
      title: formData.title,
      slug,
      excerpt: formData.excerpt,
      content: formData.content,
      author: session.email,
      authorId: session.userId,
      coverImage: formData.coverImage,
      tags: formData.tags,
      status: formData.status,
      featured: formData.featured,
      publishedAt: formData.status === 'published' ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      seo: formData.seo,
      relatedPosts: formData.relatedPosts || [],
    };

    const result = await db.collection('blogs').insertOne(blog);

    revalidatePath('/admin/blogs');
    return { 
      success: true, 
      blogId: result.insertedId.toString() 
    };
  } catch (error: any) {
    console.error('Create blog error:', error);
    return { success: false, error: error.message };
  }
}

// Update blog
export async function updateBlog(id: string, formData: BlogFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const objectId = new ObjectId(id);

    if (formData.slug) {
      const existing = await db.collection('blogs').findOne({ 
        slug: formData.slug,
        _id: { $ne: objectId }
      });
      if (existing) {
        return { success: false, error: 'A blog with this slug already exists' };
      }
    }

    const updateData: Partial<Blog> = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      coverImage: formData.coverImage,
      tags: formData.tags,
      status: formData.status,
      featured: formData.featured,
      updatedAt: new Date(),
      seo: formData.seo,
      relatedPosts: formData.relatedPosts || [],
    };

    const currentBlog = await db.collection('blogs').findOne({ _id: objectId });
    if (currentBlog?.status !== 'published' && formData.status === 'published') {
      updateData.publishedAt = new Date();
    }

    await db.collection('blogs').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    revalidatePath('/admin/blogs');
    revalidatePath(`/admin/blogs/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Update blog error:', error);
    return { success: false, error: error.message };
  }
}

// Get all published blogs (for related posts selector)
export async function getPublishedBlogs(excludeId?: string) {
  try {
    const db = await getDatabase();
    const query: any = { status: 'published' };
    
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const blogs = await db
      .collection('blogs')
      .find(query)
      .sort({ publishedAt: -1 })
      .limit(50)
      .toArray();

    return blogs.map((blog) => ({
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Get published blogs error:', error);
    return [];
  }
}

// ... keep all other functions (deleteBlog, getBlog, toggleFeatured)
export async function deleteBlog(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return { success: false, error: error.message };
  }
}

export async function getBlog(id: string) {
  try {
    const db = await getDatabase();
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return null;
    }

    return {
      ...blog,
      _id: blog._id.toString(),
    };
  } catch (error) {
    console.error('Get blog error:', error);
    return null;
  }
}

export async function toggleFeatured(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { featured: !blog.featured, updatedAt: new Date() } }
    );

    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (error: any) {
    console.error('Toggle featured error:', error);
    return { success: false, error: error.message };
  }
}
