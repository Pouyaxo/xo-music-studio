"use client";

import React from "react";
import Image from "next/image";
import { Download, Share2, Play, Pause } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import type { Track } from "@/lib/types/audioTypes";

interface FeaturedTrackProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
}

export function FeaturedTrack({
  track,
  isPlaying,
  onPlay,
}: FeaturedTrackProps) {
  const { items } = useCart();
  const isInCart = items.some((item) => item.track?.id === track.id);
  const coverArtUrl = track.cover_art
    ? getStorageUrl(track.cover_art)
    : "/images/default-cover.jpg";

  return (
    <div className="flex items-center gap-6 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
      {/* Track Image and Play Button */}
      <div className="relative w-32 h-32 group cursor-pointer" onClick={onPlay}>
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-12 h-12 text-white" />
          ) : (
            <Play className="w-12 h-12 text-white" />
          )}
        </div>
        <Image
          src={coverArtUrl}
          alt={track.title}
          fill
          className="object-cover"
          unoptimized
          priority
          crossOrigin="anonymous"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white/60">Featured Track</span>
          <span className="text-white/60">•</span>
          <span className="text-white/60">{track.bpm}BPM</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{track.title}</h2>
        <div className="flex items-center gap-3">
          <button
            className={`px-6 py-2 rounded-full ${
              isInCart
                ? "bg-[#333333] ext-white cursor-default"
                : "bg-[#1A1A1A] text-white hover:bg-[#404040]"
            } transition-colors`}
          >
            {isInCart ? "IN CART" : "$33.99"}
          </button>
          {track.allow_download && (
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Download className="w-5 h-5 text-white" />
            </button>
          )}
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          {track.tags?.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1 rounded-full bg-black/50 text-white text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
