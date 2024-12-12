"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Track } from "@/lib/types/audioTypes";
import { getAudioUrl } from "@/lib/utils/audioUtils";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  currentTime: number;
  duration: number;
  playlist: Track[];
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  togglePlayPause: () => void;
  setPlaylist: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track | null) => void;
  handleTrackClick: (track: Track) => void;
  seek: (time: number) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(
    null
  ) as React.MutableRefObject<HTMLAudioElement>;
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isLoadingRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.7;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnd = async () => {
    if (!audioRef.current) return;

    if (isRepeat && currentTrack) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error repeating track:", error);
        setIsPlaying(false);
      }
    } else {
      const nextIndex = getNextTrackIndex();
      if (nextIndex !== -1 && playlist[nextIndex]) {
        // Automatically play the next track
        await playTrack(playlist[nextIndex]);
      } else {
        // If there are no more tracks, stop playing
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    }
  };

  const handleError = (event: Event) => {
    // Get detailed error information if available
    const mediaError = audioRef.current?.error;
    console.error("Audio playback error:", {
      event,
      mediaError: mediaError
        ? {
            code: mediaError.code,
            message: mediaError.message,
          }
        : "No media error details",
    });

    setIsPlaying(false);
    isLoadingRef.current = false;
  };

  const getCurrentTrackIndex = useCallback(() => {
    return currentTrack
      ? playlist.findIndex((t) => t.id === currentTrack.id)
      : -1;
  }, [currentTrack, playlist]);

  const getNextTrackIndex = useCallback(() => {
    if (playlist.length === 0) return -1;
    const currentIndex = getCurrentTrackIndex();

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      return randomIndex;
    }

    return currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
  }, [playlist, isShuffle, getCurrentTrackIndex]);

  const getPreviousTrackIndex = () => {
    if (playlist.length === 0) return -1;
    const currentIndex = getCurrentTrackIndex();

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      return randomIndex;
    }

    return currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
  };

  const loadAudioSource = useCallback(
    async (track: Track): Promise<boolean> => {
      if (!audioRef.current || isLoadingRef.current) return false;

      try {
        isLoadingRef.current = true;
        const audioUrl = getAudioUrl(track);

        // Reset audio element
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        // Set up new source
        audioRef.current.src = audioUrl;
        audioRef.current.crossOrigin = "anonymous";

        // Wait for audio to be loaded
        await new Promise((resolve, reject) => {
          if (!audioRef.current) {
            reject(new Error("Audio element not available"));
            return;
          }

          const onCanPlay = () => {
            cleanup();
            resolve(true);
          };

          const onError = (e: Event) => {
            cleanup();
            reject(e);
          };

          const cleanup = () => {
            audioRef.current?.removeEventListener("canplay", onCanPlay);
            audioRef.current?.removeEventListener("error", onError);
          };

          audioRef.current.addEventListener("canplay", onCanPlay);
          audioRef.current.addEventListener("error", onError);
          audioRef.current.load();
        });

        return true;
      } catch (error) {
        console.error("Error loading audio source:", error);
        return false;
      } finally {
        isLoadingRef.current = false;
      }
    },
    [audioRef, isLoadingRef]
  );

  const playTrack = useCallback(
    async (track: Track) => {
      if (!audioRef.current) return;

      try {
        // Cancel any existing play promise
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }

        // Load audio source if it's a different track
        if (!currentTrack || currentTrack.id !== track.id) {
          setCurrentTrack(track);
          const loaded = await loadAudioSource(track);
          if (!loaded) return;
        }

        // Play the track
        playPromiseRef.current = audioRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing track:", error);
        setIsPlaying(false);
      } finally {
        playPromiseRef.current = null;
      }
    },
    [audioRef, currentTrack, loadAudioSource]
  );

  const playNextTrack = () => {
    const nextIndex = getNextTrackIndex();
    if (nextIndex !== -1 && playlist[nextIndex]) {
      playTrack(playlist[nextIndex]);
    }
  };

  const playPreviousTrack = () => {
    const prevIndex = getPreviousTrackIndex();
    if (prevIndex !== -1 && playlist[prevIndex]) {
      playTrack(playlist[prevIndex]);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src || audioRef.current.error) {
          await playTrack(currentTrack);
        } else {
          playPromiseRef.current = audioRef.current.play();
          await playPromiseRef.current;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTrackEndWithAutoPlay = async () => {
      if (isRepeat && currentTrack) {
        try {
          audio.currentTime = 0;
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error repeating track:", error);
          setIsPlaying(false);
        }
      } else {
        const nextIndex = getNextTrackIndex();
        if (nextIndex !== -1 && playlist[nextIndex]) {
          await playTrack(playlist[nextIndex]);
        } else {
          setIsPlaying(false);
          setCurrentTrack(null);
        }
      }
    };

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("ended", handleTrackEndWithAutoPlay);
    audio.addEventListener("error", handleError);

    return () => {
      // Remove event listeners
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("ended", handleTrackEndWithAutoPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [isRepeat, currentTrack, playlist, getNextTrackIndex, playTrack]);

  const value: AudioContextType = {
    audioRef,
    currentTrack,
    isPlaying,
    isShuffle,
    isRepeat,
    currentTime,
    duration,
    playlist,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    toggleShuffle: () => setIsShuffle((prev) => !prev),
    toggleRepeat: () => setIsRepeat((prev) => !prev),
    playNextTrack,
    playPreviousTrack,
    togglePlayPause,
    setPlaylist,
    setCurrentTrack,
    handleTrackClick,
    seek,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
