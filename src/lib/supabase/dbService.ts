import { supabase } from './supabaseClient';

export async function dbOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const maxRetries = 2;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const { data, error } = await operation();

      if (error) {
        // If unauthorized, try refreshing session
        if (error.status === 401 || error.message?.includes('JWT')) {
          const {
            data: { session },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (!refreshError && session) {
            attempts++;
            continue; // Retry operation with new token
          }
        }
        throw error;
      }

      if (!data) throw new Error('No data returned from operation');
      return data;
    } catch (error) {
      if (attempts === maxRetries - 1) {
        console.error('Database operation failed:', error);
        throw error;
      }
      attempts++;
    }
  }
  throw new Error('Operation failed after max retries');
}
