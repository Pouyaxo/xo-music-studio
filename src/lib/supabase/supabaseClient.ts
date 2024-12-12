import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { supabaseConfig } from './supabaseConfig';

// Create a singleton instance
let supabaseInstance: ReturnType<typeof initSupabaseClient> | null = null;

function initSupabaseClient() {
  const client = createClient<Database>(
    supabaseConfig.url,
    supabaseConfig.key,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage:
          typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: { 
          'x-client-info': '@supabase/auth-helpers-nextjs',
          'x-session-refresh': 'true'
        },
      },
    }
  );

  // Add session refresh on client init
  if (typeof window !== 'undefined') {
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || !session) {
        // Force refresh session
        client.auth.getSession();
      }
    });
  }

  return client;
}

// Export singleton instance
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = initSupabaseClient();
  }
  return supabaseInstance;
})();

// Helper to check auth status
export async function checkAuth() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Auth check error:', error);
    throw error;
  }

  if (!session) {
    throw new Error('No active session');
  }

  return session;
}

// Helper to refresh session
export async function refreshSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) {
    console.error('Session refresh error:', error);
    throw error;
  }

  if (!session) {
    throw new Error('Failed to refresh session');
  }

  return session;
}
