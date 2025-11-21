import { ObjectId } from 'mongodb';

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export interface Blog {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  
  // SEO fields
  seo?: BlogSEO;
  
  // Related posts
  relatedPosts?: string[]; // Array of blog IDs
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  coverImage?: string;
  
  // SEO fields
  seo?: BlogSEO;
  
  // Related posts
  relatedPosts?: string[];
}
