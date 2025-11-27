import { ObjectId } from 'mongodb';

export type EmailProvider = 'sendgrid' | 'resend' | 'mailgun' | 'aws-ses' | 'smtp';

export interface EmailConfig {
  _id?: ObjectId;
  
  // Provider Settings
  provider: EmailProvider;
  apiKey?: string;
  
  // SMTP Settings (for custom SMTP)
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  
  // From Details
  fromEmail: string;
  fromName: string;
  replyTo: string;
  
  // Settings
  enableAutoSend: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number; // seconds
  
  // Test Mode
  testMode: boolean;
  testEmail?: string; // Send all emails to this address in test mode
  
  // Templates
  templates: {
    whitepaper?: EmailTemplate;
    'case-study'?: EmailTemplate;
    newsletter?: EmailTemplate;
    brochure?: EmailTemplate;
    datasheet?: EmailTemplate;
    guide?: EmailTemplate;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  attachPDF: boolean;
  variables?: string[]; // Available template variables
}

export interface SendEmailParams {
  to: string;
  toName: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
  replyTo?: string;
}

export interface EmailLog {
  _id?: ObjectId;
  downloadId: string;
  to: string;
  subject: string;
  provider: EmailProvider;
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
}
