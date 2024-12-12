"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShareIcon, DownloadIcon } from "@/components/icons";
import { LicenseModal } from "@/components/licenses/modal/LicenseModal";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { useCart } from "@/lib/context/CartContext";
import type { Track } from "@/lib/types/audioTypes";

interface TrackRowProps {
  track: Track;
  isActive: boolean;
  duration: string;
  onClick: () => void;
}

export function TrackRow({
  track,
  isActive,
  duration,
  onClick,
}: TrackRowProps): JSX.Element {
  const [showLicenseModal, setShowLicenseModal] = React.useState(false);
  const { items } = useCart();
  const cartItem = items.find((item) => item.track?.id === track.id);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get the cover art URL, with a default fallback
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
    <>
      <div
        onClick={onClick}
        className={`playlist-row group grid grid-cols-[48px,2fr,0.5fr,0.5fr,0.5fr,2.5fr] gap-5 px-4 py-3 transition-colors cursor-pointer items-center  ${
          isActive ? "active" : ""
        }`}
      >
        {/* Cover Art */}
        <div className="w-12 h-12 relative rounded overflow-hidden bg-neutral-800">
          <Image
            src={coverArtUrl}
            alt={track.title}
            width={48}
            height={48}
            className="object-cover"
            unoptimized
            priority
            crossOrigin="anonymous"
          />
        </div>

        {/* Title */}
        <div className="text-white font-medium">
          <Link
            href={`/tracks/${track.id}`}
            className="hover:underline decoration-1 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {track.title}
          </Link>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-center text-neutral-400">
          {duration}
        </div>

        {/* BPM */}
        <div className="flex items-center justify-center text-neutral-400">
          {track.bpm || "-"}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          {track.tags?.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-white/10 rounded text-neutral-400 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {track.allow_download && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle download logic here
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLicenseModal(true);
            }}
            className={`min-w-[100px] h-9 px-4 rounded-full font-medium transition-colors flex items-center justify-center gap-1 ${
              isHydrated && cartItem
                ? "bg-[#333333] text-white cursor-default"
                : "bg-[#1A1A1A] text-white hover:bg-[#404040] cursor-pointer"
            }`}
          >
            {isHydrated && cartItem ? "IN CART" : "$33.99"}
          </button>
        </div>
      </div>

      <LicenseModal
        track={track}
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
      />
    </>
  );
}
