"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  Music,
  Calendar,
} from "lucide-react";
import { useAudioContext } from "@/lib/context/AudioContext";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { extractDominantColor } from "@/lib/utils/colorUtils";
import { formatDate } from "@/lib/utils/formatUtils";
import type { Track } from "@/lib/types/audioTypes";

interface TrackHeaderProps {
  track: Track;
  onLicenseClick: () => void;
  price?: number;
}

export function TrackHeader({
  track,
  onLicenseClick,
  price = 33.99,
}: TrackHeaderProps) {
  const { currentTrack, isPlaying, handleTrackClick } = useAudioContext();
  const [dominantColor, setDominantColor] = useState<string>("rgb(0, 0, 0)");
  const [isInCart, setIsInCart] = useState(false);
  const coverArtUrl = track.cover_art
    ? getStorageUrl(track.cover_art)
    : "/images/default-cover.jpg";
  const isCurrentTrack = currentTrack?.id === track.id;

  const extractColor = useCallback(async () => {
    if (track.cover_art) {
      try {
        const color = await extractDominantColor(coverArtUrl);
        setDominantColor(color);
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    }
  }, [track.cover_art, coverArtUrl]);

  const handleLicenseClick = () => {
    if (!isInCart) {
      setIsInCart(true);
    }
    onLicenseClick();
  };

  useEffect(() => {
    extractColor();
  }, [extractColor]);

  return (
    <div className="relative bg-[#020817] min-h-[480px]">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Primary Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${dominantColor}, transparent 60%)`,
          }}
        />

        {/* Secondary Gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 70% 60%, ${dominantColor}, transparent 50%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 40% 80%, ${dominantColor}, transparent 40%)`,
          }}
        />

        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-screen-2xl mx-auto pl-24">
        {/* Content */}
        <div className="pt-32 pb-8">
          <div className="flex gap-8">
            {/* Cover Art */}
            <div className="relative w-64 h-64 flex-shrink-0">
              <Image
                src={coverArtUrl}
                alt={track.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                unoptimized
                priority
              />
            </div>

            {/* Track Info */}
            <div className="flex-1 h-64 flex flex-col">
              {/* Title and Artist */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => handleTrackClick(track)}
                    className="w-14 h-14 flex items-center justify-center bg-[#333333]/80 text-white rounded-full hover:bg-[#404040] transition-all"
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {track.title}
                    </h1>
                    <p className="text-lg text-white/60">{track.artist}</p>
                  </div>
                </div>

                {/* Description */}
                {track.description && (
                  <p className="text-white/70 text-base mb-auto">
                    {track.description}
                  </p>
                )}
              </div>

              {/* Bottom Section */}
              <div className="mt-auto space-y-4">
                {/* Track Details */}
                <div className="flex items-center gap-8 text-base text-white/60 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span>{track.bpm} BPM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 flex-shrink-0" />
                    <span>{track.key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span>{formatDate(track.created_at || "")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLicenseClick}
                    className="h-10 px-8 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all whitespace-nowrap"
                  >
                    {isInCart ? "IN CART" : `${price}`}
                  </button>
                  <button className="h-10 px-6 flex items-center gap-2 bg-[#333333]/80 text-white rounded-full hover:bg-[#404040] transition-all whitespace-nowrap">
                    <Share2 className="w-4 h-4" />
                    SHARE
                  </button>
                  {track.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="h-10 px-6 flex items-center rounded-full bg-[#333333]/80 text-white/70 text-sm whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
