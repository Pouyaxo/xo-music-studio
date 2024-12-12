import { Track } from '../types/audioTypes';
import { getStorageUrl } from './storageUtils';

export function isWavFile(file: File): boolean {
  return file.type === 'audio/wav' || file.name.toLowerCase().endsWith('.wav');
}

export function isMp3File(file: File): boolean {
  return file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3');
}

export function getAudioUrl(track: Track): string {
  try {
    // First try tagged MP3 for streaming
    if (track.tagged_mp3) {
      const url = getStorageUrl(track.tagged_mp3);
      console.log('Using tagged MP3:', url);
      return url;
    }
    
    // Then try untagged MP3
    if (track.untagged_mp3) {
      const url = getStorageUrl(track.untagged_mp3);
      console.log('Using untagged MP3:', url);
      return url;
    }

    // If no MP3 is available, throw error
    throw new Error('No MP3 file available for streaming');
  } catch (error) {
    console.error('Error getting audio URL:', error);
    throw new Error('Failed to get audio URL');
  }
}

export function formatDuration(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    const handleSuccess = () => {
      const duration = audio.duration;
      audio.remove(); // Cleanup
      resolve(duration);
    };

    const handleError = () => {
      audio.remove(); // Cleanup
      reject(new Error('Failed to load audio'));
    };

    audio.addEventListener('loadedmetadata', handleSuccess, { once: true });
    audio.addEventListener('error', handleError, { once: true });

    // Add CORS headers
    audio.crossOrigin = 'anonymous';
    
    // Set source and load
    audio.src = url;
    audio.load();
  });
}

export function cleanFileName(fileName: string): string {
  // Remove extension first
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  return nameWithoutExt
    .replace(/[^\w\s$&'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createTaggedFileName(file: File, type: 'tagged' | 'untagged'): string {
  const baseFileName = file.name.substring(0, file.name.lastIndexOf('.'));
  const ext = file.name.split('.').pop()?.toLowerCase();
  return `${baseFileName}-${type}.${ext}`;
}