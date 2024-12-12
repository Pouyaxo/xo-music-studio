"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Share2, Package, FileAudio, Calendar, Play } from "lucide-react";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { extractDominantColor } from "@/lib/utils/colorUtils";
import { formatDate } from "@/lib/utils/formatUtils";
import type { SoundKit } from "@/lib/types/soundKitTypes";
import { useCart } from "@/lib/context/CartContext";

interface SoundKitHeaderProps {
  soundKit: SoundKit;
}

export function SoundKitHeader({ soundKit }: SoundKitHeaderProps) {
  const [dominantColor, setDominantColor] = useState<string>("rgb(0, 0, 0)");
  const { items } = useCart();
  const isInCart = items.some((item) => item.id === soundKit.id);
  const [isPlaying, setIsPlaying] = useState(false);

  const coverUrl = soundKit.cover_art
    ? getStorageUrl(soundKit.cover_art)
    : "/images/default-cover.jpg";

  const extractColor = useCallback(async () => {
    if (soundKit.cover_art) {
      try {
        const color = await extractDominantColor(coverUrl);
        setDominantColor(color);
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    }
  }, [soundKit.cover_art, coverUrl]);

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
        <div className="pt-32 pb-8">
          <div className="flex gap-8">
            {/* Cover Art */}
            <div className="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={coverUrl}
                alt={soundKit.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                unoptimized
                priority
              />
            </div>

            {/* Sound Kit Info */}
            <div className="flex-1 h-64 flex flex-col justify-between">
              {/* Top Section */}
              <div>
                {/* Title and Play Button */}
                <div className="flex items-center gap-4">
                  <button className="w-14 h-14 flex items-center justify-center bg-[#333333]/80 text-white rounded-full hover:bg-[#404040] transition-all">
                    <Play className="w-6 h-6 ml-1" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {soundKit.title}
                    </h1>
                    <p className="text-lg text-white/60">by Pouya</p>
                  </div>
                </div>

                {/* Description */}
                {soundKit.description && (
                  <p className="text-white/70 text-base max-w-3xl mt-4">
                    {soundKit.description}
                  </p>
                )}
              </div>

              {/* Bottom Section */}
              <div>
                {/* Kit Details */}
                <div className="flex items-center gap-8 text-base text-white/60 whitespace-nowrap mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 flex-shrink-0" />
                    <span>{soundKit.format || "WAV"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span>{formatDate(soundKit.created_at || "")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    className={`h-10 px-8 font-medium rounded-full transition-all whitespace-nowrap ${
                      isInCart
                        ? "bg-[#333333] text-white cursor-default"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {isInCart ? "IN CART" : `$${soundKit.price.toFixed(2)}`}
                  </button>
                  <button className="h-10 px-6 flex items-center gap-2 bg-[#333333]/80 text-white rounded-full hover:bg-[#404040] transition-all whitespace-nowrap">
                    <Share2 className="w-4 h-4" />
                    SHARE
                  </button>
                  {soundKit.tags?.map((tag) => (
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
