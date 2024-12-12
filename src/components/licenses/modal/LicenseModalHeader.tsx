"use client";

import React from "react";
import { Track } from "@/lib/types/audioTypes";
import Image from "next/image";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { X, Music } from "lucide-react";

interface LicenseModalHeaderProps {
  track: Track;
  onClose: () => void;
}

export function LicenseModalHeader({
  track,
  onClose,
}: LicenseModalHeaderProps) {
  // Get cover art URL with proper error handling and memoization
  const coverArtUrl = React.useMemo(() => {
    if (!track.cover_art) return "/images/default-cover.jpg";
    try {
      return getStorageUrl(track.cover_art);
    } catch (error) {
      console.error("Error getting cover art URL:", error);
      return "/images/default-cover.jpg";
    }
  }, [track.cover_art]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Choose contract type</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative w-32 h-32 bg-neutral-800 rounded overflow-hidden">
          <Image
            src={coverArtUrl}
            alt={track.title}
            fill
            className="object-cover"
            unoptimized
            priority
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-8 h-8 text-white/70" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{track.title}</h3>
          <p className="text-gray-400">{track.artist}</p>
        </div>
      </div>
    </div>
  );
}
