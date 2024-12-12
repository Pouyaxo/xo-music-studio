import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active sessions and refresh if needed
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session && mounted) {
          // Check if token needs refresh (if expires within 5 minutes)
          const expiresAt = new Date(session.expires_at || 0).getTime();
          const shouldRefresh = expiresAt - Date.now() < 5 * 60 * 1000;

          if (shouldRefresh) {
            const {
              data: { session: newSession },
              error: refreshError,
            } = await supabase.auth.refreshSession();

            if (!refreshError && newSession && mounted) {
              setUser(newSession.user);
            }
          } else if (mounted) {
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);

        // Handle specific auth events
        if (event === 'TOKEN_REFRESHED') {
          // Optionally trigger a data refresh here
          checkSession();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: Error | null }>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await query();
        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, dependencies]);

  return { data, error, loading };
}
