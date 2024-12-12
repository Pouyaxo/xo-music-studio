// src/lib/utils/audio.ts
import type { Track } from '@/lib/types/audioTypes';

export function getAudioSource(track: Track): string | undefined {
  return track.untagged_mp3 || track.tagged_mp3 || track.file_path;
}

export function initializeAudio(): HTMLAudioElement {
  const audio = new Audio();
  audio.preload = 'metadata';
  return audio;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

export async function validateAudioFile(file: File): Promise<{
  isValid: boolean;
  message?: string;
}> {
  if (!isAudioFile(file)) {
    return {
      isValid: false,
      message: 'File must be an audio file',
    };
  }

  if (file.size > 100 * 1024 * 1024) {
    return {
      isValid: false,
      message: 'File size must be less than 100MB',
    };
  }

  return { isValid: true };
}