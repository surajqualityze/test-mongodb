import { ObjectId } from 'mongodb';

export type ResourceType = 
  | 'whitepaper' 
  | 'case-study' 
  | 'newsletter' 
  | 'brochure' 
  | 'datasheet' 
  | 'guide';

export type EmailStatus = 'delivered' | 'failed' | 'pending' | 'bounced';
export type EmailProvider = 'sendgrid' | 'mailgun' | 'aws-ses' | 'resend';
export type FollowUpStatus = 'pending' | 'contacted' | 'converted' | 'not-interested';

export interface Download {
  _id?: ObjectId;
  
  // Resource Info
  resourceType: ResourceType;
  resourceId: string; // ObjectId as string
  resourceTitle: string;
  resourceUrl?: string; // PDF URL
  
  // User Info
  userEmail: string;
  userName: string;
  userPhone?: string;
  userCompany?: string;
  userJobTitle?: string;
  
  // Additional Form Data
  formData?: {
    country?: string;
    industry?: string;
    consent?: boolean;
    marketingConsent?: boolean;
    [key: string]: any; // For custom fields
  };
  
  // Email Tracking
  emailSent: boolean;
  emailSentAt?: Date;
  emailStatus: EmailStatus;
  emailProvider?: EmailProvider;
  emailId?: string; // Tracking ID from email service
  emailError?: string;
  
  // Analytics
  downloadedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  device?: string; // mobile, desktop, tablet
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  
  // Follow-up
  followUpRequired: boolean;
  followUpStatus: FollowUpStatus;
  followUpNotes?: string;
  assignedTo?: string; // Admin user email
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadFormData {
  resourceType: ResourceType;
  resourceId: string;
  resourceTitle: string;
  resourceUrl?: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  userCompany?: string;
  userJobTitle?: string;
  formData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface DownloadStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  byResourceType: Record<ResourceType, number>;
  byStatus: Record<EmailStatus, number>;
  topResources: Array<{
    resourceId: string;
    resourceTitle: string;
    resourceType: ResourceType;
    count: number;
  }>;
  recentDownloads: Download[];
}

export interface EmailConfig {
  _id?: ObjectId;
  provider: EmailProvider;
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  enableAutoSend: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number; // seconds
  templates: {
    [key in ResourceType]?: {
      subject: string;
      htmlBody: string;
      textBody: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
