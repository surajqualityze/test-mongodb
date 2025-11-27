'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { EmailConfig } from '@/types/email';

// Get email configuration
export async function getEmailConfig() {
  try {
    const db = await getDatabase();
    const config = await db.collection('email_config').findOne({});
    
    if (!config) {
      return null;
    }

    // Don't send sensitive data to client
    const safeConfig = {
      ...config,
      _id: config._id.toString(),
      apiKey: config.apiKey ? '••••••••' : undefined,
      smtpPassword: config.smtpPassword ? '••••••••' : undefined,
    };

    return safeConfig;
  } catch (error) {
    console.error('Get email config error:', error);
    return null;
  }
}

// Save email configuration
export async function saveEmailConfig(config: Partial<EmailConfig>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    // Check if config exists
    const existing = await db.collection('email_config').findOne({});
    
    const configData = {
      ...config,
      updatedAt: new Date(),
    };

    if (existing) {
      // Update existing
      await db.collection('email_config').updateOne(
        { _id: existing._id },
        { $set: configData }
      );
    } else {
      // Create new
      await db.collection('email_config').insertOne({
        ...configData,
        createdAt: new Date(),
      });
    }

    revalidatePath('/admin/downloads/emails');
    return { success: true };
  } catch (error: any) {
    console.error('Save email config error:', error);
    return { success: false, error: error.message };
  }
}

// Test email configuration
export async function testEmailConfig(testEmail: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const { sendEmail } = await import('@/lib/email');
    
    const result = await sendEmail({
      to: testEmail,
      toName: 'Test User',
      subject: 'Test Email from Qualityze Admin',
      htmlBody: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p>If you received this email, your email settings are configured properly!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent from Qualityze Admin Panel<br>
          ${new Date().toLocaleString()}
        </p>
      `,
      textBody: `
        Email Configuration Test
        
        This is a test email to verify your email configuration is working correctly.
        If you received this email, your email settings are configured properly!
        
        Sent from Qualityze Admin Panel
        ${new Date().toLocaleString()}
      `,
    });

    return result;
  } catch (error: any) {
    console.error('Test email error:', error);
    return { success: false, error: error.message };
  }
}

// Get email logs
export async function getEmailLogs(limit: number = 50) {
  try {
    const db = await getDatabase();
    const logs = await db
      .collection('email_logs')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return logs.map(log => ({
      ...log,
      _id: log._id.toString(),
    }));
  } catch (error) {
    console.error('Get email logs error:', error);
    return [];
  }
}
