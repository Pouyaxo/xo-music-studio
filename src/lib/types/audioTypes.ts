// src/lib/types/audio.types.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  tags: string[];
  track_type: string;
  release_date?: string | undefined;
  cover_art?: string | undefined;
  untagged_mp3?: string | undefined;
  untagged_wav?: string | undefined;
  tagged_mp3?: string | undefined;
  tagged_wav?: string | undefined;
  stems_file?: string | undefined;
  allow_download: boolean;
  free_download_type?: string | undefined;
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
  bpm?: number | undefined;
  key?: string | undefined;
  collaborators?: any;
  related_videos: string[];
  not_for_sale: boolean;
  private: boolean;
  exclude_bulk_discount: boolean;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  track_id: string;
  file_path?: string;
  is_featured?: boolean;
  duration?: string;
}


export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  currentTrack: Track | null;
}

export interface AudioPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
}