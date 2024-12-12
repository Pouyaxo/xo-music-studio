import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user ?? null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function checkAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}