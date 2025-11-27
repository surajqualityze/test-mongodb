import { ObjectId } from 'mongodb';

export interface WhitepaperSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export interface Whitepaper {
  _id?: ObjectId;
  
  // Basic Info
  title: string;
  slug: string;
  description: string;
  category: string;
  industries: string[];
  
  // Content
  summary: string;
  highlights: string[]; // Key takeaways/bullet points
  coverImage?: string;
  
  // File
  pdfUrl: string;
  fileSize?: string;
  pageCount?: number;
  
  // Author
  author: string;
  authorTitle?: string;
  publishDate: Date;
  
  // Status
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: Date;
  featured: boolean;
  
  // SEO
  seo?: WhitepaperSEO;
  
  // Stats
  views: number;
  downloads: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface WhitepaperFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  industries: string[];
  summary: string;
  highlights: string[];
  coverImage?: string;
  pdfUrl: string;
  fileSize?: string;
  pageCount?: number;
  author: string;
  authorTitle?: string;
  publishDate: Date;
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: Date;
  featured: boolean;
  seo?: WhitepaperSEO;
}
