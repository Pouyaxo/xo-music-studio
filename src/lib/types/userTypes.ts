export interface UserProfile {
  uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  location?: string;
  profile_photo_url?: string;
  created_at?: string;
  updated_at?: string;
}