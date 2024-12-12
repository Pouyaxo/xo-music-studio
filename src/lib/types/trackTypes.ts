export interface TrackFormData {
  title: string;
  artist: string;
  tags: string[];
  track_type: string;
  release_date: string | null;
  preferences: {
    private: boolean;
  };
}