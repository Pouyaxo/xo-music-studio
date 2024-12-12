"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { TrackControls } from "./TrackControls";
import { cn } from "@/lib/utils";
import { useAudioContext } from "@/lib/context/AudioContext";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { Share2, List, FileText, ChevronUp } from "lucide-react";
import { LicenseModal } from "@/components/licenses/modal/LicenseModal";
import { useCart } from "@/lib/context/CartContext";

interface BottomPlayerProps {
  className?: string;
}

export function BottomPlayer({ className }: BottomPlayerProps) {
  const [showLicenseModal, setShowLicenseModal] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [translateY, setTranslateY] = React.useState(0);
  const [showRestoreButton, setShowRestoreButton] = React.useState(false);
  const { items } = useCart();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playNextTrack,
    playPreviousTrack,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    seek,
    audioRef,
    togglePlayPause,
  } = useAudioContext();

  // Get cover art URL with proper error handling and memoization
  const coverArtUrl = React.useMemo(() => {
    if (!currentTrack?.cover_art) return "/images/default-cover.jpg";
    try {
      return getStorageUrl(currentTrack.cover_art);
    } catch (error) {
      console.error("Error getting cover art URL:", error);
      return "/images/default-cover.jpg";
    }
  }, [currentTrack?.cover_art]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - startY;
    if (delta > 0) {
      setTranslateY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 50) {
      setIsHidden(true);
    }
    setTranslateY(0);
  };

  // Handle mouse position to show/hide restore button
  React.useEffect(() => {
    if (!isHidden) return;

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = window.innerHeight - 100;
      setShowRestoreButton(e.clientY > threshold);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHidden]);

  if (!currentTrack) return null;

  const cartItem = items.find((item) => item.track?.id === currentTrack.id);

  return (
    <>
      {showRestoreButton && isHidden && (
        <button
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black hover:bg-neutral-900 text-white p-3 rounded-full transition-all transform hover:-translate-y-1 z-50"
          onClick={() => setIsHidden(false)}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-black z-50 transition-transform",
          className,
          isHidden && "translate-y-[calc(100%+4px)]"
        )}
        style={{
          transform: isHidden
            ? "translateY(calc(100% + 4px))"
            : `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <ProgressBar
          value={currentTime}
          max={duration}
          onChange={seek}
          className="absolute left-0 right-0 -top-1"
        />

        <div className="flex items-center h-20">
          {/* Left section with cover art and track info */}
          <div className="flex items-center min-w-0 w-[30%]">
            <div className="h-20 w-20 relative flex-shrink-0">
              <Image
                src={coverArtUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
                unoptimized
                priority
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex items-center gap-4 min-w-0 px-4">
              <div className="min-w-0">
                <Link
                  href={`/tracks/${currentTrack.id}`}
                  className="font-medium truncate text-white hover:underline decoration-1 block"
                >
                  {currentTrack.title}
                </Link>
                <div className="text-sm text-neutral-400 truncate">
                  {currentTrack.artist}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                  <Share2 className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => setShowLicenseModal(true)}
                  className={`min-w-[100px] h-9 px-4 rounded-full font-medium transition-colors flex items-center justify-center gap-1 ${
                    cartItem
                      ? "bg-[#333333] text-white cursor-default"
                      : "bg-[#1A1A1A] text-white hover:bg-[#404040] cursor-pointer"
                  }`}
                >
                  {cartItem ? "IN CART" : "$33.99"}
                </button>
              </div>
            </div>
          </div>

          {/* Center section with player controls */}
          <div className="flex-1 flex justify-center">
            <TrackControls
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onNext={playNextTrack}
              onPrevious={playPreviousTrack}
              onRepeatToggle={toggleRepeat}
              onShuffleToggle={toggleShuffle}
              isRepeat={isRepeat}
              isShuffle={isShuffle}
            />
          </div>

          {/* Right section with volume and additional controls */}
          <div className="flex items-center justify-end gap-4 w-[30%] px-4">
            <VolumeControl
              volume={audioRef.current?.volume || 1}
              muted={audioRef.current?.muted || false}
              onVolumeChange={(value) => {
                if (audioRef.current) audioRef.current.volume = value;
              }}
              onMuteToggle={() => {
                if (audioRef.current)
                  audioRef.current.muted = !audioRef.current.muted;
              }}
            />
            <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <FileText className="w-4 h-4 text-neutral-400" />
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <List className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      <LicenseModal
        track={currentTrack}
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
      />
    </>
  );
}
