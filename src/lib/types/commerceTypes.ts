import type { Track } from "./audioTypes";
import type { SoundKit } from "./soundKitTypes";

export interface CartItem {
  id: string;
  price: number;
  productType: "sound_kit" | "beat" | "studio" | "mixing" | "mastering";
  track?: Track;
  soundKit?: SoundKit;
  licenseType?: string;
}

export interface TrackPricing {
  mp3LeasePrice?: number;
  wavLeasePrice?: number;
  stemsLeasePrice?: number;
  unlimitedPrice?: number;
  notForSale: boolean;
  excludeBulkDiscount: boolean;
}

export interface SocialRequirements {
  requiredAction?: string;
  socialPlatforms: string[];
}