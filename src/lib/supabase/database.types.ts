export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      playlists: {
        Row: {
          id: string;
          name: string;
          description?: string;
          cover_image?: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['playlists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['playlists']['Row']>;
      };
      tracks: {
        Row: {
          id: string;
          title: string;
          artist: string;
          tags: string[];
          track_type: string;
          release_date?: string;
          cover_art?: string;
          untagged_mp3?: string;
          untagged_wav?: string;
          tagged_mp3?: string;
          tagged_wav?: string;
          stems_file?: string;
          allow_download: boolean;
          free_download_type?: string;
          required_action?: string;
          social_platforms: string[];
          mp3_license_price?: number;
          wav_license_price?: number;
          stems_license_price?: number;
          unlimited_license_price?: number;
          primary_genre?: string;
          subgenre?: string;
          primary_mood?: string;
          secondary_mood?: string;
          description?: string;
          bpm?: number;
          key?: string;
          collaborators?: Json;
          related_videos: string[];
          not_for_sale: boolean;
          private: boolean;
          exclude_bulk_discount: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          track_id: string;
          file_path?: string;
          is_featured?: boolean;
        };
        Insert: Omit<Database['public']['Tables']['tracks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tracks']['Row']>;
      };
      users: {
        Row: {
          uuid: string;
          email: string;
          profile_photo_url?: string;
          first_name?: string;
          last_name?: string;
          display_name?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'uuid'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      licenses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          price: number;
          file_types: string[];
          is_enabled: boolean;
          is_featured: boolean;
          distribution_limit?: number;
          streaming_limit?: number;
          music_video_limit?: number;
          radio_station_limit?: number;
          allow_profit_performances: boolean;
          require_tagging: boolean;
          require_credit: boolean;
          custom_terms?: string;
          default_for_new_tracks: boolean;
          created_at?: string;
          updated_at?: string;
          order?: number;
        };
        Insert: Omit<Database['public']['Tables']['licenses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['licenses']['Row']>;
      };
      sound_kits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          price: number;
          description?: string;
          cover_art?: string;
          sound_kit_file?: string;
          tags?: string[];
          features?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['sound_kits']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sound_kits']['Row']>;
      };
      comments: {
        Row: {
          id: string;
          content: string;
          user_id: string;
          item_id: string;
          item_type: 'track' | 'sound_kit';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Row']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}