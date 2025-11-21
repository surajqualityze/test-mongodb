import { NextResponse } from 'next/server';
import { createAdminUser } from '@/actions/auth-actions';

export async function POST(request: Request) {
  try {
    console.log('📥 Setup request received');
    
    const body = await request.json();
    console.log('📧 Request body:', body);
    
    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Calling createAdminUser...');
    const result = await createAdminUser(email, password, name);
    console.log('📊 Result:', result);

    if (result.success) {
      console.log('✅ Admin user created successfully');
      return NextResponse.json({ message: 'Admin user created successfully' });
    }

    console.log('❌ Failed to create user:', result.error);
    return NextResponse.json({ 
      error: result.error || 'Failed to create user' 
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('❌ Setup route error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
