import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkAuth, refreshSession } from '@/lib/supabase/supabaseClient';
import { toast } from 'sonner';

export function useAuthGuard() {
  const router = useRouter();
  const { user, initialized, loading } = useAuthStore();

  useEffect(() => {
    const validateSession = async () => {
      try {
        if (!user) {
          throw new Error('No user found');
        }

        // Verify session is valid
        await checkAuth();

        // Proactively refresh if token is about to expire
        const session = await refreshSession();
        const tokenExpiryTime = new Date(session.expires_at || 0).getTime();
        const isExpiringSoon = tokenExpiryTime - Date.now() < 300000; // 5 minutes

        if (isExpiringSoon) {
          await refreshSession();
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        toast.error('Your session has expired. Please log in again.');
        router.push('/login');
      }
    };

    if (initialized && !loading) {
      validateSession();
    }
  }, [user, initialized, loading, router]);

  // Set up periodic session check
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        try {
          await checkAuth();
        } catch (error) {
          console.error('Periodic auth check failed:', error);
          toast.error('Your session has expired. Please log in again.');
          router.push('/login');
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, router]);

  return { isAuthenticated: !!user, isLoading: loading || !initialized };
}