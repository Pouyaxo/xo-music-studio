"use client";

import React from "react";
import Image from "next/image";
import { X, Music } from "lucide-react";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import type { CartItem as CartItemType } from "@/lib/types/commerceTypes";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export const CartItem = React.memo(function CartItem({
  item,
  onRemove,
}: CartItemProps) {
  const coverArtUrl = React.useMemo(() => {
    if (item.track) {
      return getStorageUrl(item.track.cover_art || null);
    }
    if (item.soundKit) {
      return getStorageUrl(item.soundKit.cover_art || null);
    }
    return "/images/default-cover.jpg";
  }, [item]);

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(item.id);
    },
    [item.id, onRemove]
  );

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 relative flex-shrink-0 bg-neutral-800 rounded overflow-hidden">
        <Image
          src={coverArtUrl}
          alt={item.track?.title || item.soundKit?.title || ""}
          fill
          className="object-cover"
          unoptimized
          priority
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Music className="w-4 h-4 text-white/70" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">
          {item.track?.title || item.soundKit?.title}
        </h4>
        <p className="text-sm text-gray-400">
          {item.licenseType?.toString() || "Sound Kit"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium">${item.price}</span>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
