import { getDatabase } from './mongodb';
import type { EmailConfig, SendEmailParams, EmailProvider } from '@/types/email';

// Get email configuration
export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const db = await getDatabase();
    const config = await db.collection('email_config').findOne({});
    return config as EmailConfig | null;
  } catch (error) {
    console.error('Get email config error:', error);
    return null;
  }
}

// Send email using configured provider
export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const config = await getEmailConfig();
    
    if (!config) {
      return { success: false, error: 'Email not configured' };
    }

    if (!config.enableAutoSend) {
      return { success: false, error: 'Auto-send is disabled' };
    }

    // If in test mode, override recipient
    const recipient = config.testMode && config.testEmail 
      ? config.testEmail 
      : params.to;

    // Route to appropriate provider
    switch (config.provider) {
      case 'resend':
        return await sendWithResend(config, { ...params, to: recipient });
      
      case 'sendgrid':
        return await sendWithSendGrid(config, { ...params, to: recipient });
      
      case 'mailgun':
        return await sendWithMailgun(config, { ...params, to: recipient });
      
      case 'aws-ses':
        return await sendWithAWSSES(config, { ...params, to: recipient });
      
      case 'smtp':
        return await sendWithSMTP(config, { ...params, to: recipient });
      
      default:
        return { success: false, error: 'Invalid email provider' };
    }
  } catch (error: any) {
    console.error('Send email error:', error);
    return { success: false, error: error.message };
  }
}

// Resend integration
async function sendWithResend(config: EmailConfig, params: SendEmailParams) {
  try {
    const Resend = require('resend').Resend;
    const resend = new Resend(config.apiKey);

    const emailData: any = {
      from: `${config.fromName} <${config.fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html: params.htmlBody,
      text: params.textBody,
      replyTo: params.replyTo || config.replyTo,
    };

    // Add attachments if provided
    if (params.attachments && params.attachments.length > 0) {
      emailData.attachments = params.attachments;
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// SendGrid integration
async function sendWithSendGrid(config: EmailConfig, params: SendEmailParams) {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.apiKey);

    const msg = {
      to: params.to,
      from: {
        email: config.fromEmail,
        name: config.fromName,
      },
      subject: params.subject,
      text: params.textBody,
      html: params.htmlBody,
      replyTo: params.replyTo || config.replyTo,
      attachments: params.attachments?.map(att => ({
        content: att.content?.toString('base64'),
        filename: att.filename,
        type: 'application/pdf',
        disposition: 'attachment',
      })),
    };

    const response = await sgMail.send(msg);
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Mailgun integration
async function sendWithMailgun(config: EmailConfig, params: SendEmailParams) {
  try {
    // Mailgun implementation
    return { success: false, error: 'Mailgun integration not implemented yet' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// AWS SES integration
async function sendWithAWSSES(config: EmailConfig, params: SendEmailParams) {
  try {
    // AWS SES implementation
    return { success: false, error: 'AWS SES integration not implemented yet' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// SMTP integration
async function sendWithSMTP(config: EmailConfig, params: SendEmailParams) {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: params.to,
      subject: params.subject,
      text: params.textBody,
      html: params.htmlBody,
      replyTo: params.replyTo || config.replyTo,
      attachments: params.attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Template helper - replace variables in template
export function processTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value);
  });
  
  return processed;
}

// Send whitepaper download email
export async function sendWhitepaperEmail(
  downloadId: string,
  whitepaperTitle: string,
  pdfUrl: string,
  userEmail: string,
  userName: string
) {
  try {
    const config = await getEmailConfig();
    
    if (!config || !config.templates.whitepaper) {
      return { success: false, error: 'Email template not configured' };
    }

    const template = config.templates.whitepaper;
    
    // Process template variables
    const variables = {
      userName,
      whitepaperTitle,
      downloadLink: pdfUrl,
      companyName: config.fromName,
      year: new Date().getFullYear().toString(),
    };

    const subject = processTemplate(template.subject, variables);
    const htmlBody = processTemplate(template.htmlBody, variables);
    const textBody = processTemplate(template.textBody, variables);

    // Send email
    const result = await sendEmail({
      to: userEmail,
      toName: userName,
      subject,
      htmlBody,
      textBody,
    });

    // Log the email
    const db = await getDatabase();
    await db.collection('email_logs').insertOne({
      downloadId,
      to: userEmail,
      subject,
      provider: config.provider,
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      error: result.error,
      sentAt: result.success ? new Date() : undefined,
      createdAt: new Date(),
    });

    return result;
  } catch (error: any) {
    console.error('Send whitepaper email error:', error);
    return { success: false, error: error.message };
  }
}
