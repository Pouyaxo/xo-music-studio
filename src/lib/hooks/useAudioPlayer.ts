// src/hooks/use-audio-player.ts
import { useState, useRef, useEffect } from 'react';
import { events } from '@/lib/events/audioEvents';
import type { Track, AudioPlayerState } from '@/lib/types/audioTypes';

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    currentTrack: null
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };

    const handleDurationChange = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration
      }));
    };

    const handleEnded = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const handleTrackSelect = (track: Track) => {
      if (audioRef.current) {
        const source = track.untagged_mp3 || track.tagged_mp3 || track.file_path;
        if (source) {
          audioRef.current.src = source;
          setState(prev => ({
            ...prev,
            currentTrack: track
          }));
          audioRef.current.play()
            .then(() => {
              setState(prev => ({
                ...prev,
                isPlaying: true
              }));
            })
            .catch(console.error);
        }
      }
    };

    events.on('trackSelected', handleTrackSelect);
    return () => {
      events.off('trackSelected', handleTrackSelect);
    };
  }, []);

  const controls = {
    play: async () => {
      if (audioRef.current) {
        await audioRef.current.play();
        setState(prev => ({
          ...prev,
          isPlaying: true
        }));
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setState(prev => ({
          ...prev,
          isPlaying: false
        }));
      }
    },
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    setVolume: (value: number) => {
      if (audioRef.current) {
        audioRef.current.volume = value;
        setState(prev => ({
          ...prev,
          volume: value
        }));
      }
    },
    toggleMute: () => {
      if (audioRef.current) {
        const newMuted = !audioRef.current.muted;
        audioRef.current.muted = newMuted;
        setState(prev => ({
          ...prev,
          muted: newMuted
        }));
      }
    }
  };

  return {
    ...state,
    controls
  };
}