'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { Training, TrainingFormData } from '@/types/training';

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Create training
export async function createTraining(formData: TrainingFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    const slug = formData.slug || generateSlug(formData.title);
    
    // Check if slug exists
    const existing = await db.collection('trainings').findOne({ slug });
    if (existing) {
      return { success: false, error: 'A training with this slug already exists' };
    }

    // Get speaker name
    const speaker = await db.collection('speakers').findOne({ 
      _id: new ObjectId(formData.speakerId) 
    });
    
    if (!speaker) {
      return { success: false, error: 'Speaker not found' };
    }

    const training: Omit<Training, '_id'> = {
      ...formData,
      slug,
      speakerName: speaker.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    const result = await db.collection('trainings').insertOne(training);

    revalidatePath('/admin/trainings');
    return { 
      success: true, 
      trainingId: result.insertedId.toString() 
    };
  } catch (error: any) {
    console.error('Create training error:', error);
    return { success: false, error: error.message };
  }
}

// Update training
export async function updateTraining(id: string, formData: TrainingFormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const objectId = new ObjectId(id);

    // Check slug uniqueness
    if (formData.slug) {
      const existing = await db.collection('trainings').findOne({ 
        slug: formData.slug,
        _id: { $ne: objectId }
      });
      if (existing) {
        return { success: false, error: 'A training with this slug already exists' };
      }
    }

    // Get speaker name
    const speaker = await db.collection('speakers').findOne({ 
      _id: new ObjectId(formData.speakerId) 
    });
    
    if (!speaker) {
      return { success: false, error: 'Speaker not found' };
    }

    const updateData: Partial<Training> = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      speakerName: speaker.name,
      updatedAt: new Date(),
    };

    await db.collection('trainings').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    revalidatePath('/admin/trainings');
    revalidatePath(`/admin/trainings/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Update training error:', error);
    return { success: false, error: error.message };
  }
}

// Delete training
export async function deleteTraining(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    await db.collection('trainings').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/trainings');
    return { success: true };
  } catch (error: any) {
    console.error('Delete training error:', error);
    return { success: false, error: error.message };
  }
}

// Get single training
export async function getTraining(id: string) {
  try {
    const db = await getDatabase();
    const training = await db.collection('trainings').findOne({ _id: new ObjectId(id) });
    
    if (!training) {
      return null;
    }

    return {
      ...training,
      _id: training._id.toString(),
    };
  } catch (error) {
    console.error('Get training error:', error);
    return null;
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
    const training = await db.collection('trainings').findOne({ _id: new ObjectId(id) });
    
    if (!training) {
      return { success: false, error: 'Training not found' };
    }

    await db.collection('trainings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { featured: !training.featured, updatedAt: new Date() } }
    );

    revalidatePath('/admin/trainings');
    return { success: true };
  } catch (error: any) {
    console.error('Toggle featured error:', error);
    return { success: false, error: error.message };
  }
}

// Get all trainings
export async function getAllTrainings() {
  try {
    const db = await getDatabase();
    const trainings = await db
      .collection('trainings')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return trainings.map((training) => ({
      ...training,
      _id: training._id.toString(),
    }));
  } catch (error) {
    console.error('Get trainings error:', error);
    return [];
  }
}
