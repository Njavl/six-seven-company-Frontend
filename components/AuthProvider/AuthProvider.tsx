'use client';

import { useEffect } from 'react';
import { getCurrentUser, refreshSession } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        const hasSession = await refreshSession();

        if (!hasSession) {
          clearUser();
          return;
        }

        const user = await getCurrentUser();
        setUser(user);
      } catch {
        clearUser();
      }
    };

    initAuth();
  }, [setUser, clearUser, setIsLoading]);

  return <>{children}</>;
}