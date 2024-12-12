"use client";
import React from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPreviousIcon,
  ShuffleIcon,
  RepeatIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface TrackControlsProps {
  isPlaying: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRepeatToggle: () => void;
  onShuffleToggle: () => void;
  className?: string;
}

export function TrackControls({
  isPlaying,
  isRepeat,
  isShuffle,
  onPlayPause,
  onNext,
  onPrevious,
  onRepeatToggle,
  onShuffleToggle,
  className,
}: TrackControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <button
        onClick={onShuffleToggle}
        className={cn(
          "p-2 hover:bg-neutral-800 rounded-full transition-colors",
          isShuffle ? "text-primary fill-primary" : "text-white fill-white"
        )}
        aria-label="Toggle shuffle"
      >
        <ShuffleIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onPrevious}
        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white fill-white"
        aria-label="Previous track"
      >
        <SkipPreviousIcon className="w-6 h-6" />
      </button>
      <button
        onClick={onPlayPause}
        className="w-12 h-12 bg-neutral-800/90 text-white fill-white rounded-full hover:scale-105 transition-transform grid place-items-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <div className="relative">
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6 relative left-[2px]" />
          )}
        </div>
      </button>
      <button
        onClick={onNext}
        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white fill-white"
        aria-label="Next track"
      >
        <SkipNextIcon className="w-6 h-6" />
      </button>
      <button
        onClick={onRepeatToggle}
        className={cn(
          "p-2 hover:bg-neutral-800 rounded-full transition-colors",
          isRepeat ? "text-primary fill-primary" : "text-white fill-white"
        )}
        aria-label="Toggle repeat"
      >
        <RepeatIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
