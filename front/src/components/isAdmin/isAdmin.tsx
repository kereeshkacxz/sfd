'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function isAdminWithRedirect() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminStatus = localStorage.getItem('admin') === 'true';
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        router.push('/');
      }
      
      setIsCheckingAuth(false);
    }
  }, [ router]);

  return { isAdmin, isCheckingAuth };
}

export function isAdmin() {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem('admin') === 'true';
}
