export type ProductType = 
  | 'beat_license' 
  | 'sound_kit' 
  | 'studio_time' 
  | 'mixing' 
  | 'mastering';

interface ProductDisplayInfo {
  typeLabel: string;
  description: string;
}

const PRODUCT_DISPLAY_INFO: Record<ProductType, ProductDisplayInfo> = {
  beat_license: {
    typeLabel: 'License Type',
    description: 'Digital Product - Music License',
  },
  sound_kit: {
    typeLabel: 'Sound Kit',
    description: 'Digital Product - Sample Pack',
  },
  studio_time: {
    typeLabel: 'Studio Session',
    description: 'Service - Recording Time',
  },
  mixing: {
    typeLabel: 'Mixing Service',
    description: 'Service - Professional Mix',
  },
  mastering: {
    typeLabel: 'Mastering Service',
    description: 'Service - Professional Master',
  },
};

export function getProductTypeLabel(type: ProductType): string {
  return PRODUCT_DISPLAY_INFO[type].typeLabel;
}

export function getProductDescription(type: ProductType): string {
  return PRODUCT_DISPLAY_INFO[type].description;
} 