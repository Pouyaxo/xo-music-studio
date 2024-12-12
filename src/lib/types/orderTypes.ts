import type { Track } from './audioTypes';
import type { License } from './licenseTypes';
import type { SoundKit } from './soundKitTypes';

export interface OrderItem {
  item_type: 'track' | 'license' | 'service' | 'sound_kit' | 'studio_booking';
  track?: Track;
  license?: License;
  service?: {
    name: string;
    description: string;
  };
  sound_kit?: SoundKit;
  studio_booking?: {
    booking_date: string;
    total_hours: number;
    with_engineer: boolean;
  };
} 