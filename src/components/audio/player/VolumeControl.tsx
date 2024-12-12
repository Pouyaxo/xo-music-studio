"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";
import { VolumeIcon, MuteIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
  className,
}: VolumeControlProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onMuteToggle}
        className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
      >
        {muted || volume === 0 ? (
          <MuteIcon className="w-5 h-5" />
        ) : (
          <VolumeIcon className="w-5 h-5" />
        )}
      </button>
      <div className="group">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-24 h-5"
          value={[muted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={([newValue]) => onVolumeChange(newValue / 100)}
          aria-label="Volume"
        >
          <Slider.Track className="bg-neutral-800 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-white rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="opacity-0 group-hover:opacity-100 block w-3 h-3 bg-white rounded-full hover:scale-110 transition-all focus:outline-none cursor-pointer"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>
    </div>
  );
}
