"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import type { SoundKit } from "@/lib/types/soundKitTypes";

interface SoundKitCardProps {
  soundKit: SoundKit;
}

export function SoundKitCard({ soundKit }: SoundKitCardProps) {
  const coverArtUrl = React.useMemo(() => {
    if (!soundKit.cover_art) return "/images/default-cover.jpg";
    try {
      return getStorageUrl(soundKit.cover_art);
    } catch (error) {
      console.error("Error getting cover art URL:", error);
      return "/images/default-cover.jpg";
    }
  }, [soundKit.cover_art]);

  return (
    <div className="group cursor-pointer w-[280px]">
      <Link href={`/soundkits/${soundKit.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
          <div className="relative w-full h-full">
            <Image
              src={coverArtUrl}
              alt={soundKit.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
              priority
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium truncate">{soundKit.title}</h3>
          <p className="text-gray-400">${soundKit.price.toFixed(2)}</p>
        </div>
        <Link
          href={`/soundkits/${soundKit.id}`}
          className="bg-[#333333] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#404040] transition-colors"
        >
          DETAILS
        </Link>
      </div>
    </div>
  );
}
