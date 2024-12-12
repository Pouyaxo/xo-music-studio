"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Track } from "@/lib/types/audioTypes";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { useCart } from "@/lib/context/CartContext";
import {
  ChevronDown,
  ChevronUp,
  X,
  Mic,
  Radio,
  Video,
  Music,
  Share2,
  Download,
} from "lucide-react";
import { useDataStore } from "@/lib/store/dataStore";
import { License } from "@/lib/types/licenseTypes";

interface LicenseModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseModal({ track, isOpen, onClose }: LicenseModalProps) {
  const { addToCart, isInCart } = useCart();
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
  const licenses = useDataStore((state) => state.licenses);

  // Get cover art URL with proper error handling and memoization
  const coverArtUrl = React.useMemo(() => {
    if (!track?.cover_art) return "/images/default-cover.jpg";
    try {
      return getStorageUrl(track.cover_art);
    } catch (error) {
      console.error("Error getting cover art URL:", error);
      return "/images/default-cover.jpg";
    }
  }, [track?.cover_art]);

  const handleLicenseClick = (license: License) => {
    addToCart({
      id: `${track?.id}:${license.name}:beat`,
      track: track!,
      licenseType: license.name,
      price: license.price,
      productType: "beat",
    });
  };

  const toggleLicense = (licenseName: string) => {
    setExpandedLicense(expandedLicense === licenseName ? null : licenseName);
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Mic,
      Radio,
      Video,
      Music,
      Share2,
      Download,
    };
    return icons[iconName as keyof typeof icons];
  };

  const getLicenseFeatures = (license: License) => [
    // Recording
    {
      icon: <Mic className="w-5 h-5" />,
      text: "Used for Music Recording",
    },
    // Distribution
    {
      icon: <Share2 className="w-5 h-5" />,
      text: `Distribute up to ${
        license.distribution_limit === 0 || !license.distribution_limit
          ? "Unlimited"
          : license.distribution_limit.toLocaleString()
      } copies`,
    },
    // Streaming
    {
      icon: <Music className="w-5 h-5" />,
      text: `${
        license.streaming_limit === 0 || !license.streaming_limit
          ? "Unlimited"
          : license.streaming_limit.toLocaleString()
      } Online Audio Streams`,
    },
    // Live Performance
    {
      icon: <Download className="w-5 h-5" />,
      text: "For Profit Live Performances",
    },
    // Music Videos
    {
      icon: <Video className="w-5 h-5" />,
      text: `${
        license.music_video_limit === 0 || !license.music_video_limit
          ? "Unlimited"
          : license.music_video_limit
      } Music Video${license.music_video_limit === 1 ? "" : "s"}`,
    },
    // Radio
    {
      icon: <Radio className="w-5 h-5" />,
      text: `Radio Broadcasting rights (${
        license.radio_station_limit === 0 || !license.radio_station_limit
          ? "Unlimited"
          : license.radio_station_limit
      } stations)`,
    },
  ];

  const renderPriceButton = (license: License) => {
    const inCart = track && isInCart(track.id, license.name, "beat");

    if (inCart) {
      return (
        <button
          disabled
          className="min-w-[120px] h-10 bg-[#333333] text-white px-6 rounded-full flex items-center justify-center cursor-default"
        >
          IN CART
        </button>
      );
    }

    if (license.name.toLowerCase().includes("exclusive")) {
      return (
        <button
          onClick={() => handleLicenseClick(license)}
          className="min-w-[120px] h-10 bg-[#222222] text-white px-6 rounded-full flex items-center justify-center hover:bg-[#333333] transition-colors"
        >
          OFFER
        </button>
      );
    }

    return (
      <button
        onClick={() => handleLicenseClick(license)}
        className="min-w-[120px] h-10 bg-[#222222] text-white px-6 rounded-full flex items-center justify-center hover:bg-[#333333] transition-colors"
      >
        <span className="mr-1">+</span>${license.price}
      </button>
    );
  };

  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] bg-black border-none text-white p-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Choose License Type</DialogTitle>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Choose contract type</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Track Info */}
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
              <h3 className="text-xl font-bold">{track.title}</h3>
              <p className="text-gray-400">{track.artist}</p>
            </div>
          </div>

          {/* License Options */}
          <div className="space-y-2">
            {licenses.map((license) => (
              <div
                key={license.id}
                className="bg-[#111111] rounded-lg overflow-hidden"
              >
                {/* Main License Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{license.name}</h4>
                      <p className="text-sm text-gray-400">
                        {license.file_types.join(" & ")}
                      </p>
                    </div>
                    {renderPriceButton(license)}
                  </div>

                  {/* Features when expanded */}
                  {expandedLicense === license.name && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {getLicenseFeatures(license).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {feature.icon}
                          <span className="text-gray-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show/Hide Terms Button at bottom */}
                <button
                  onClick={() => toggleLicense(license.name)}
                  className="w-full py-3 text-center text-gray-400 hover:text-white bg-[#0A0A0A] text-sm font-medium transition-colors"
                >
                  {expandedLicense === license.name
                    ? "Hide usage terms"
                    : "Show usage terms"}
                </button>
              </div>
            ))}
          </div>

          {/* Negotiate Option */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 mb-2">Or, you can also:</p>
            <button className="text-white hover:underline">
              Negotiate the price
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
