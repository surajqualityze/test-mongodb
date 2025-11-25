import { ObjectId } from 'mongodb';

export interface Speaker {
  _id?: ObjectId;
  name: string;
  photoUrl?: string;
  expertise: string;
  years: number;
  industries: string[];
  bio: string;
}
