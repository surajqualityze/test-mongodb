import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  expiresAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  // Session expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const session = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // 1 hour expiration
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return session;
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    // Check if session is expired
    const expiresAt = new Date((payload.exp as number) * 1000);
    if (expiresAt < new Date()) {
      return null; // Session expired
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      expiresAt: expiresAt,
    };
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return verifySession(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
