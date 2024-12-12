"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  rows?: number;
  className?: string;
  variant?: 'license' | 'soundkit' | 'track';
}

export function SkeletonLoader({ 
  rows = 1, 
  className,
  variant = 'license'
}: SkeletonLoaderProps) {
  if (variant === 'track') {
    return (
      <div className="animate-pulse">
        {/* Track Header Skeleton */}
        <div className="relative min-h-[480px] bg-zinc-900/50">
          <div className="max-w-screen-2xl mx-auto px-24 py-32">
            <div className="flex gap-8">
              {/* Cover Art */}
              <div className="w-32 h-32 bg-zinc-800/50 rounded-lg" />
              
              {/* Track Info */}
              <div className="flex-1">
                <div className="h-4 w-24 bg-zinc-800/50 rounded mb-2" />
                <div className="h-8 w-64 bg-zinc-800/50 rounded mb-4" />
                <div className="h-4 w-48 bg-zinc-800/50 rounded mb-8" />
                <div className="flex gap-4">
                  <div className="h-10 w-32 bg-zinc-800/50 rounded-full" />
                  <div className="h-10 w-10 bg-zinc-800/50 rounded-full" />
                  <div className="h-10 w-24 bg-zinc-800/50 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-screen-2xl mx-auto px-24">
          {/* Comments Section */}
          <div className="mt-16">
            <div className="h-6 w-48 bg-zinc-800/50 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-zinc-800/50 rounded" />
              ))}
            </div>
          </div>

          {/* Related Tracks */}
          <div className="mt-16">
            <div className="h-6 w-48 bg-zinc-800/50 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-zinc-800/50 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10",
      "opacity-0 animate-in fade-in duration-300",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "grid gap-4 p-4 bg-zinc-900/50",
        variant === 'license' ? 'grid-cols-[auto,auto,2fr,1fr,1fr]' : 'grid-cols-[auto,2fr,1fr,1fr]'
      )}>
        <div className="h-4 w-4 bg-zinc-800/50" />
        {variant === 'license' && <div className="h-4 w-4 bg-zinc-800/50" />}
        <div className="h-4 w-24 bg-zinc-800/50" />
        <div className="h-4 w-20 bg-zinc-800/50" />
        <div className="h-4 w-16 bg-zinc-800/50 justify-self-end" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "grid gap-4 p-4 items-center",
              variant === 'license' ? 'grid-cols-[auto,auto,2fr,1fr,1fr]' : 'grid-cols-[auto,2fr,1fr,1fr]'
            )}
          >
            <div className="h-4 w-4 bg-zinc-800/50" />
            {variant === 'license' && <div className="h-4 w-4 bg-zinc-800/50" />}
            <div className="h-4 w-48 bg-zinc-800/50" />
            <div className="h-4 w-32 bg-zinc-800/50" />
            <div className="flex justify-end gap-2">
              {variant === 'license' ? (
                <>
                  <div className="h-8 w-8 bg-zinc-800/50 rounded-full" />
                  <div className="h-8 w-8 bg-zinc-800/50 rounded-full" />
                </>
              ) : (
                <>
                  <div className="h-8 w-8 bg-zinc-800/50 rounded-full" />
                  <div className="h-8 w-8 bg-zinc-800/50 rounded-full" />
                  <div className="h-8 w-8 bg-zinc-800/50 rounded-full" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}