export interface License {
  id: string;
  user_id: string;
  name: string;
  type: 'non-exclusive' | 'exclusive';
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
  isPopular?: boolean;
  features: string[];
  bulkDeal?: string;
}

// Form data extends License but omits server-side fields
export type LicenseFormData = Omit<License, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type ProductType = 
  | "beat"
  | "sound_kit" 
  | "studio" 
  | "mixing" 
  | "mastering";

export const PRODUCT_DISPLAY_NAMES: Record<ProductType, string> = {
  beat: "Beat",
  sound_kit: "Sound Kit",
  studio: "Studio Session",
  mixing: "Mixing Service",
  mastering: "Mastering Service",
};

export const formatLicenseDisplay = (licenseName: string): string => {
  return licenseName;
};