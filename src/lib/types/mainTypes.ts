export interface TrackFormData {
  title: string;
  artist: string;
  tags: string[];
  track_type: string;
  release_date: string | null;
  cover_art: File | null;
  file_path: string | null;
  audio_files: {
    untagged_mp3: File | null;
    untagged_wav: File | null;
    tagged_wav: File | null;
    stems_file: File | null;
  };
  preferences: {
    not_for_sale: boolean;
    private: boolean;
    exclude_bulk_discount: boolean;
  };
  pricing: {
    mp3_license_price: number;
    wav_license_price: number;
    stems_license_price: number;
    unlimited_license_price: number;
  };
  free_download: {
    enabled: boolean;
    download_type: string;
    required_action: string;
    social_platforms: string[];
  };
  details: {
    primary_genre: string;
    subgenre: string;
    primary_mood: string;
    secondary_mood: string;
    description: string;
    bpm: string;
    key: string;
  };
  collaborators: Array<{
    name: string;
    role: string;
    shares: string;
  }>;
  related_videos: string[];
}