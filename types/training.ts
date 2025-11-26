import { ObjectId } from 'mongodb';

export interface TrainingSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export interface PricingOption {
  name: string;
  price: number;
}

export interface Training {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  content: string;
  duration: string; // e.g., "60 Mins"
  level: 'basic' | 'intermediate' | 'advanced' | 'basic/intermediate';
  type: 'live' | 'recorded' | 'on-demand';
  date?: Date;
  industry: string;
  subIndustry?: string;
  tags: string[];
  speakerId: string;
  speakerName: string;
  coverImage?: string;
  pricingOptions: PricingOption[];
  regularPrice: number;
  discountPrice?: number;
  webinarId?: string;
  whoShouldAttend?: string;
  overview?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  seo?: TrainingSEO;
  relatedTrainings?: string[];
}

export interface TrainingFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  duration: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'basic/intermediate';
  type: 'live' | 'recorded' | 'on-demand';
  date?: Date;
  industry: string;
  subIndustry?: string;
  tags: string[];
  speakerId: string;
  coverImage?: string;
  pricingOptions: PricingOption[];
  regularPrice: number;
  discountPrice?: number;
  whoShouldAttend?: string;
  overview?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seo?: TrainingSEO;
  relatedTrainings?: string[];
}

export interface TrainingSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}
