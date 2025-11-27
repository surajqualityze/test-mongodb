'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AutoLogoutProps {
  expiresAt: Date; // Date object from your session
}

export default function AutoLogout({ expiresAt }: AutoLogoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Convert Date to timestamp
    const expiresAtTimestamp = Math.floor(expiresAt.getTime() / 1000);
    
    // Check session expiration every 30 seconds
    const checkInterval = setInterval(async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // Session expired
      if (now >= expiresAtTimestamp) {
        clearInterval(checkInterval);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login?expired=true');
        router.refresh();
      }
    }, 30000); // Check every 30 seconds

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, [expiresAt, router]);

  return null; // This component doesn't render anything
}
