export interface Comment {
  id: string;
  content: string;
  user_id: string;
  item_id: string;
  item_type: 'track' | 'sound_kit';
  created_at: string;
  updated_at: string;
  user?: {
    display_name?: string;
    profile_photo_url?: string;
  };
}

export interface CommentFormData {
  content: string;
  item_id: string;
  item_type: 'track' | 'sound_kit';
} 