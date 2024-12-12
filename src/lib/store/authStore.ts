import { create } from 'zustand';
import { supabase } from '../supabase/supabaseClient';
import { retryableFetch } from '../utils/fetchUtils';

interface AuthState {
  user: any | null;
  initialized: boolean;
  loading: boolean;
  setUser: (user: any | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (updates: Partial<any>) => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  loading: false,

  setUser: (user) => set({ user }),

  updateUserData: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },

  refreshSession: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // If there's an auth error (like missing session), clear the user
        if (error.name === 'AuthSessionMissingError') {
          set({ user: null, initialized: true, loading: false });
          return;
        }
        throw error;
      }

      if (user) {
        set({ user, initialized: true, loading: false });
      } else {
        // If no user is found, clear the user state
        set({ user: null, initialized: true, loading: false });
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      // Set user to null on error to ensure consistent state
      set({ user: null, initialized: true, loading: false });
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          get().refreshSession();
        } else if (event === 'SIGNED_OUT') {
          set({ user: null });
        }
      });

      if (session?.user) {
        await get().refreshSession();
      }

      set({ initialized: true });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ initialized: true });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state after successful logout
      set({ user: null, loading: false });
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear user state even if there's an error
      set({ user: null, loading: false });
    }
  },
}));

// Initialize auth store on import
useAuthStore.getState().initialize();