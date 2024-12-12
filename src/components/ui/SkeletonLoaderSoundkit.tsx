"use client";

import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
}

export function SkeletonLoaderSoundKit({ rows = 5 }: SkeletonLoaderProps) {
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="grid grid-cols-[auto,2fr,1fr,1fr] gap-4 p-4 bg-zinc-900/50">
        <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-16 bg-zinc-800 rounded justify-self-end animate-pulse" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto,2fr,1fr,1fr] gap-4 p-4 items-center"
          >
            <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}