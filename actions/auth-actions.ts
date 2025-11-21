'use server';

import { getDatabase } from '@/lib/mongodb';
import {
  createSession,
  deleteSession,
  verifyPassword,
  hashPassword,
} from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string
) {
  try {
    console.log('🔄 createAdminUser called with:', { email, name });
    
    console.log('🔌 Connecting to database...');
    const db = await getDatabase();
    console.log('✅ Database connected');
    
    console.log('🔍 Checking if user exists...');
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      console.log('❌ User already exists');
      return { success: false, error: 'User already exists' };
    }
    console.log('✅ User does not exist, proceeding...');

    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('✅ Password hashed');

    console.log('💾 Inserting user into database...');
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ User inserted:', result.insertedId);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Create user error:', error);
    console.error('Error stack:', error.stack);
    return { 
      success: false, 
      error: `Failed to create user: ${error.message}` 
    };
  }
}
