import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AdminRootPage() {
  const session = await getSession();
  
  if (session) {
    // Logged in → Go to dashboard
    redirect('/admin/dashboard');
  } else {
    // Not logged in → Go to login
    redirect('/admin/login');
  }
}
