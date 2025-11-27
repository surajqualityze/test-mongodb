'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { Whitepaper, WhitepaperFormData } from '@/types/whitepaper';

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Create whitepaper
export async function createWhitepaper(formData: WhitepaperFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    const slug = formData.slug || generateSlug(formData.title);
    
    // Check if slug exists
    const existing = await db.collection('whitepapers').findOne({ slug });
    if (existing) {
      return { success: false, error: 'A whitepaper with this slug already exists' };
    }

    const whitepaper: Omit<Whitepaper, '_id'> = {
      ...formData,
      slug,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('whitepapers').insertOne(whitepaper);

    revalidatePath('/admin/whitepapers');
    return { 
      success: true, 
      whitepaperId: result.insertedId.toString() 
    };
  } catch (error: any) {
    console.error('Create whitepaper error:', error);
    return { success: false, error: error.message };
  }
}

// Update whitepaper
export async function updateWhitepaper(id: string, formData: WhitepaperFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const objectId = new ObjectId(id);

    // Check slug uniqueness
    if (formData.slug) {
      const existing = await db.collection('whitepapers').findOne({ 
        slug: formData.slug,
        _id: { $ne: objectId }
      });
      if (existing) {
        return { success: false, error: 'A whitepaper with this slug already exists' };
      }
    }

    const updateData: Partial<Whitepaper> = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      updatedAt: new Date(),
    };

    await db.collection('whitepapers').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    revalidatePath('/admin/whitepapers');
    revalidatePath(`/admin/whitepapers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Update whitepaper error:', error);
    return { success: false, error: error.message };
  }
}

// Delete whitepaper
export async function deleteWhitepaper(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    await db.collection('whitepapers').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/whitepapers');
    return { success: true };
  } catch (error: any) {
    console.error('Delete whitepaper error:', error);
    return { success: false, error: error.message };
  }
}

// Get single whitepaper
export async function getWhitepaper(id: string) {
  try {
    const db = await getDatabase();
    const whitepaper = await db.collection('whitepapers').findOne({ _id: new ObjectId(id) });
    
    if (!whitepaper) {
      return null;
    }

    return {
      ...whitepaper,
      _id: whitepaper._id.toString(),
    };
  } catch (error) {
    console.error('Get whitepaper error:', error);
    return null;
  }
}

// Get all whitepapers
export async function getAllWhitepapers() {
  try {
    const db = await getDatabase();
    const whitepapers = await db
      .collection('whitepapers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return whitepapers.map((whitepaper) => ({
      ...whitepaper,
      _id: whitepaper._id.toString(),
    }));
  } catch (error) {
    console.error('Get whitepapers error:', error);
    return [];
  }
}

// Toggle featured
export async function toggleFeatured(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const whitepaper = await db.collection('whitepapers').findOne({ _id: new ObjectId(id) });
    
    if (!whitepaper) {
      return { success: false, error: 'Whitepaper not found' };
    }

    await db.collection('whitepapers').updateOne(
      { _id: new ObjectId(id) },
      { $set: { featured: !whitepaper.featured, updatedAt: new Date() } }
    );

    revalidatePath('/admin/whitepapers');
    return { success: true };
  } catch (error: any) {
    console.error('Toggle featured error:', error);
    return { success: false, error: error.message };
  }
}

// Track whitepaper download and send email
export async function trackWhitepaperDownload(
  whitepaperId: string,
  userData: {
    email: string;
    name: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    formData?: any;
  },
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }
) {
  try {
    const db = await getDatabase();
    
    // Get whitepaper details
    const whitepaper = await db.collection('whitepapers').findOne({ 
      _id: new ObjectId(whitepaperId) 
    });
    
    if (!whitepaper) {
      return { success: false, error: 'Whitepaper not found' };
    }

    // Increment download count
    await db.collection('whitepapers').updateOne(
      { _id: new ObjectId(whitepaperId) },
      { 
        $inc: { downloads: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    // Create download record
    const download = {
      resourceType: 'whitepaper',
      resourceId: whitepaperId,
      resourceTitle: whitepaper.title,
      resourceUrl: whitepaper.pdfUrl,
      userEmail: userData.email,
      userName: userData.name,
      userPhone: userData.phone,
      userCompany: userData.company,
      userJobTitle: userData.jobTitle,
      formData: userData.formData,
      emailSent: false,
      emailStatus: 'pending',
      followUpRequired: true,
      followUpStatus: 'pending',
      downloadedAt: new Date(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      referrer: metadata?.referrer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('downloads').insertOne(download);
    const downloadId = result.insertedId.toString();

    // Send email asynchronously (don't wait for it to complete)
    sendWhitepaperEmailAsync(
      downloadId,
      whitepaper.title,
      whitepaper.pdfUrl,
      userData.email,
      userData.name
    ).catch(error => {
      console.error('Background email error:', error);
    });
    
    revalidatePath('/admin/whitepapers');
    revalidatePath('/admin/downloads');
    
    return { 
      success: true,
      downloadId,
      pdfUrl: whitepaper.pdfUrl 
    };
  } catch (error: any) {
    console.error('Track download error:', error);
    return { success: false, error: error.message };
  }
}

// Send whitepaper email asynchronously
async function sendWhitepaperEmailAsync(
  downloadId: string,
  whitepaperTitle: string,
  pdfUrl: string,
  userEmail: string,
  userName: string
) {
  try {
    // Import dynamically to avoid circular dependencies
    const { sendWhitepaperEmail } = await import('@/lib/email');
    
    console.log(`📧 Sending whitepaper email to ${userEmail}...`);
    
    const result = await sendWhitepaperEmail(
      downloadId,
      whitepaperTitle,
      pdfUrl,
      userEmail,
      userName
    );

    // Update download record with email status
    const db = await getDatabase();
    await db.collection('downloads').updateOne(
      { _id: new ObjectId(downloadId) },
      {
        $set: {
          emailSent: result.success,
          emailStatus: result.success ? 'delivered' : 'failed',
          emailSentAt: result.success ? new Date() : undefined,
          emailError: result.error,
          updatedAt: new Date(),
        },
      }
    );

    if (result.success) {
      console.log(`✅ Email sent successfully to ${userEmail}`);
    } else {
      console.error(`❌ Email failed to ${userEmail}:`, result.error);
    }

    return result;
  } catch (error: any) {
    console.error('Send email async error:', error);
    
    // Update download record with error
    try {
      const db = await getDatabase();
      await db.collection('downloads').updateOne(
        { _id: new ObjectId(downloadId) },
        {
          $set: {
            emailSent: false,
            emailStatus: 'failed',
            emailError: error.message,
            updatedAt: new Date(),
          },
        }
      );
    } catch (dbError) {
      console.error('Failed to update download record:', dbError);
    }
    
    return { success: false, error: error.message };
  }
}

// Manual retry for failed email
export async function retryWhitepaperEmail(downloadId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const download = await db.collection('downloads').findOne({ 
      _id: new ObjectId(downloadId) 
    });
    
    if (!download) {
      return { success: false, error: 'Download record not found' };
    }

    if (download.emailStatus === 'delivered') {
      return { success: false, error: 'Email already delivered' };
    }

    // Retry sending email
    await sendWhitepaperEmailAsync(
      downloadId,
      download.resourceTitle,
      download.resourceUrl,
      download.userEmail,
      download.userName
    );

    revalidatePath('/admin/downloads');
    return { success: true, message: 'Email retry initiated' };
  } catch (error: any) {
    console.error('Retry email error:', error);
    return { success: false, error: error.message };
  }
}
