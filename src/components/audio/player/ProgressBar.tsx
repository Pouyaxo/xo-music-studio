'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  onChange,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('relative w-full group z-10', className)}>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-1"
        value={[value]}
        max={max}
        step={0.1}
        onValueChange={([newValue]) => onChange(newValue)}
        aria-label="Progress"
      >
        <Slider.Track className="relative w-full h-full overflow-hidden">
          <div className="absolute h-full w-full bg-neutral-800" />
          <Slider.Range className="absolute h-full bg-white" />
        </Slider.Track>
        <Slider.Thumb
          className="opacity-0 group-hover:opacity-100 block w-3 h-3 bg-white rounded-full hover:scale-110 transition-all focus:outline-none cursor-pointer"
          aria-label="Progress"
        />
      </Slider.Root>
    </div>
  );
}
