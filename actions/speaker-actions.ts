'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { Speaker } from '@/types/speaker';

// Get all speakers (already exists, but let's make sure)
// Get all speakers
// Get all speakers
export async function getAllSpeakers() {
  try {
    const db = await getDatabase();
    const speakers = await db
      .collection('speakers')
      .find()
      .sort({ name: 1 })
      .toArray();
    
    return speakers.map(s => ({
      _id: s._id.toString(),
      name: s.name,
      photoUrl: s.photoUrl,  // Make sure this is included
      expertise: s.expertise || '',
      years: s.years || 0,
      industries: s.industries || [],
      bio: s.bio || '',
    }));
  } catch (error) {
    // console.error('Get all speakers error:', error);
    return [];
  }
}



// Get single speaker
export async function getSpeaker(id: string) {
  try {
    const db = await getDatabase();
    const speaker = await db.collection('speakers').findOne({ _id: new ObjectId(id) });
    
    if (!speaker) {
      return null;
    }

    // Get trainings by this speaker
    const trainings = await db
      .collection('trainings')
      .find({ speakerId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      ...speaker,
      _id: speaker._id.toString(),
      trainings: trainings.map(t => ({
        _id: t._id.toString(),
        title: t.title,
        type: t.type,
        status: t.status,
      })),
    };
  } catch (error) {
    console.error('Get speaker error:', error);
    return null;
  }
}

// Create speaker
export async function createSpeaker(formData: Omit<Speaker, '_id'>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    // Check if speaker with same name exists
    const existing = await db.collection('speakers').findOne({ 
      name: formData.name 
    });
    if (existing) {
      return { success: false, error: 'A speaker with this name already exists' };
    }

    const speaker = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('speakers').insertOne(speaker);

    revalidatePath('/admin/speakers');
    return { 
      success: true, 
      speakerId: result.insertedId.toString() 
    };
  } catch (error: any) {
    console.error('Create speaker error:', error);
    return { success: false, error: error.message };
  }
}

// Update speaker
export async function updateSpeaker(id: string, formData: Omit<Speaker, '_id'>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    const objectId = new ObjectId(id);

    // Check name uniqueness
    const existing = await db.collection('speakers').findOne({ 
      name: formData.name,
      _id: { $ne: objectId }
    });
    if (existing) {
      return { success: false, error: 'A speaker with this name already exists' };
    }

    const updateData = {
      ...formData,
      updatedAt: new Date(),
    };

    await db.collection('speakers').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    // Update speaker name in all trainings
    await db.collection('trainings').updateMany(
      { speakerId: id },
      { $set: { speakerName: formData.name } }
    );

    revalidatePath('/admin/speakers');
    revalidatePath(`/admin/speakers/${id}`);
    revalidatePath('/admin/trainings');
    return { success: true };
  } catch (error: any) {
    console.error('Update speaker error:', error);
    return { success: false, error: error.message };
  }
}

// Delete speaker
export async function deleteSpeaker(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = await getDatabase();
    
    // Check if speaker has trainings
    const trainingCount = await db.collection('trainings').countDocuments({ speakerId: id });
    if (trainingCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete speaker. ${trainingCount} training(s) are assigned to this speaker.` 
      };
    }

    await db.collection('speakers').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/speakers');
    return { success: true };
  } catch (error: any) {
    console.error('Delete speaker error:', error);
    return { success: false, error: error.message };
  }
}
