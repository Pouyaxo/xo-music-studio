import type { OrderItem } from '@/lib/types/orderTypes';

function getItemTitle(item: OrderItem) {
    switch(item.item_type) {
      case 'track':
        return item.track?.title ? `${item.track.title} - ${item.track.artist}` : 'Track';
      case 'license':
        return item.track?.title ? `License for ${item.track.title}` : 'License';
      case 'service':
        return item.service?.name || 'Service';
      case 'sound_kit':
        return item.sound_kit?.title || 'Sound Kit';
      case 'studio_booking':
        return item.studio_booking?.booking_date ? 
          `Studio Booking - ${new Date(item.studio_booking.booking_date).toLocaleDateString()}` : 
          'Studio Booking';
      default:
        return 'Purchase';
    }
  }
  
  function getItemDescription(item: OrderItem) {
    switch(item.item_type) {
      case 'track':
        return `Track purchase`;
      case 'license':
        return `License for ${item.track?.title || 'Unknown Track'}`;
      case 'service':
        return item.service?.description || 'Service';
      case 'sound_kit':
        return `Sound Kit: ${item.sound_kit?.description || ''}`;
      case 'studio_booking':
        return `${item.studio_booking?.total_hours || 0} hours, ${item.studio_booking?.with_engineer ? 'with' : 'without'} engineer`;
      default:
        return '';
    }
  } 