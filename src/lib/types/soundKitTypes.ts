export interface SoundKitFormData {
  title: string;
  artist: string;
  price: number;
  description: string;
  cover_art: File | null;
  sound_kit_file: File | null;
  preview_file: File | null;
  tags: string[];
  features: string[];
  collaborators: Array<{
    name: string;
    role: string;
    shares: string;
  }>;
}

export interface SoundKit {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  price: number;
  description: string;
  cover_art?: string;
  sound_kit_file?: string;
  preview_file?: string;
  format?: string;
  size?: string;
  samples?: any[];
  tags: string[];
  features: string[];
  created_at: string;
  updated_at: string;
  collaborators: string[];
}