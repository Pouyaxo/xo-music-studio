// Playlist-specific types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_image?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}