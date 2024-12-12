import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/supabaseClient';
import type { License } from '../types/licenseTypes';
import type { SoundKit } from '../types/soundKitTypes';
import type { Track } from '../types/audioTypes';

interface DataState {
  licenses: License[];
  soundKits: SoundKit[];
  tracks: Track[];
  error: Record<string, string | null>;
  isLoading: Record<string, boolean>;
  lastFetched: Record<string, number>;
  setData: (type: 'licenses' | 'soundKits' | 'tracks', data: any[]) => void;
  fetchData: (type: 'licenses' | 'soundKits' | 'tracks', force?: boolean) => Promise<void>;
  invalidateData: (type: 'licenses' | 'soundKits' | 'tracks') => void;
  fetchLicenses: () => Promise<void>;
  uploadFile: (file: File, bucket: keyof typeof LOCAL_STORAGE_BUCKETS, userId: string) => Promise<string>;
  deleteFile: (path: string, bucket: keyof typeof LOCAL_STORAGE_BUCKETS) => Promise<void>;
}

const TABLE_NAMES = {
  licenses: 'licenses',
  soundKits: 'sound_kits',
  tracks: 'tracks'
} as const;

const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

// Rename to avoid conflict
const LOCAL_STORAGE_BUCKETS = {
  tracks: 'tracks',
  stems: 'stems',
  covers: 'covers',
  avatars: 'avatars',
  sound_kits: 'sound_kits',
  sound_kits_covers: 'sound_kits_covers'
} as const;

interface BucketConfig {
  mimeTypes: string[];
  maxSize: number;
  public: boolean;
  path: (userId: string) => string;
}

const BUCKET_CONFIGS: Record<keyof typeof LOCAL_STORAGE_BUCKETS, BucketConfig> = {
  [LOCAL_STORAGE_BUCKETS.tracks]: {
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
    maxSize: 100 * 1024 * 1024, // 100MB
    public: true,
    path: (userId: string) => `${userId}/tracks`
  },
  [LOCAL_STORAGE_BUCKETS.stems]: {
    mimeTypes: ['audio/wav', 'application/zip'],
    maxSize: 500 * 1024 * 1024, // 500MB
    public: true,
    path: (userId: string) => `${userId}/stems`
  },
  [LOCAL_STORAGE_BUCKETS.covers]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    public: true,
    path: (userId: string) => `${userId}/covers`
  },
  [LOCAL_STORAGE_BUCKETS.avatars]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024,
    public: true,
    path: (userId: string) => `${userId}/avatar`
  },
  [LOCAL_STORAGE_BUCKETS.sound_kits]: {
    mimeTypes: ['application/zip'],
    maxSize: 1024 * 1024 * 1024, // 1GB
    public: true,
    path: (userId: string) => `${userId}/sound-kits`
  },
  [LOCAL_STORAGE_BUCKETS.sound_kits_covers]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    public: true,
    path: (userId: string) => `${userId}/sound-kits-covers`
  }
} as const;

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      licenses: [],
      soundKits: [],
      tracks: [],
      error: {},
      isLoading: {},
      lastFetched: {},

      setData: (type, data) => {
        set({
          [type]: data,
          lastFetched: {
            ...get().lastFetched,
            [type]: Date.now()
          },
          isLoading: {
            ...get().isLoading,
            [type]: false
          }
        });
      },

      fetchData: async (type, force = false) => {
        try {
          set(state => ({
            isLoading: { ...state.isLoading, [type]: true }
          }));

          const tableName = TABLE_NAMES[type];
          let query = supabase.from(tableName).select('*');

          // Add specific ordering based on type
          if (type === 'licenses') {
            query = query.order('order', { ascending: true });
          } else {
            query = query.order('created_at', { ascending: false });
          }

          const { data, error } = await query;

          if (error) throw error;
          
          set(state => ({ 
            [type]: data || [],
            isLoading: { ...state.isLoading, [type]: false },
            error: { ...state.error, [type]: null }
          }));

        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
          set(state => ({ 
            error: { ...state.error, [type]: 'Failed to fetch data' },
            isLoading: { ...state.isLoading, [type]: false }
          }));
        }
      },

      invalidateData: (type) => {
        set(state => ({
          lastFetched: {
            ...state.lastFetched,
            [type]: 0 // Force refetch on next access
          }
        }));
      },

      fetchLicenses: async () => {
        const { data } = await supabase
          .from('licenses')
          .select('*')
          .order('order');
        set({ licenses: (data || []).map(license => ({
          ...license,
          features: [],
          type: license.type as "non-exclusive" | "exclusive"
        })) });
      },

      uploadFile: async (file: File, bucket: keyof typeof LOCAL_STORAGE_BUCKETS, userId: string) => {
        try {
          // Check file size and type based on bucket config
          const config = BUCKET_CONFIGS[bucket];
          if (file.size > config.maxSize) {
            throw new Error(`File size must be less than ${config.maxSize / (1024 * 1024)}MB`);
          }
          if (!config.mimeTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${config.mimeTypes.join(', ')}`);
          }

          const fileExt = file.name.split('.').pop();
          const filePath = `${config.path(userId)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              upsert: true,
              cacheControl: '3600',
              contentType: file.type
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          return publicUrl;
        } catch (error) {
          console.error('Upload error:', error);
          throw error;
        }
      },

      deleteFile: async (path: string, bucket: keyof typeof LOCAL_STORAGE_BUCKETS) => {
        try {
          const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

          if (error) throw error;
        } catch (error) {
          console.error('Delete error:', error);
          throw error;
        }
      }
    }),
    {
      name: 'app-data-storage'
    }
  )
);