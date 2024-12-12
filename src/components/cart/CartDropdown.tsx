"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useCart } from "@/lib/context/CartContext";
import Image from "next/image";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { X, Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { License } from "@/lib/types/licenseTypes";

export function CartDropdown() {
  const router = useRouter();
  const { items, total, removeFromCart } = useCart();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-white lg:block hidden">
            ${total.toFixed(2)}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 p-4 bg-black border border-[#222222] text-white shadow-lg"
        align="end"
        sideOffset={8}
      >
        <h3 className="text-lg font-bold mb-4">YOUR CART ({items.length}):</h3>

        {items.map((item) => (
          <CartItem
            key={item.id}
            item={{
              id: item.id,
              track: {
                title: item.track?.title ?? "Untitled Track",
                cover_art: item.track?.cover_art ?? null,
              },
              licenseType: item.licenseType ?? "Standard License",
              price: item.price,
            }}
            coverArtUrl={getStorageUrl(item.track?.cover_art ?? null)}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}

        {items.length > 0 ? (
          <div className="mt-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-white text-black py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
            <button
              onClick={() => router.push("/beats")}
              className="w-full text-center mt-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400">Your cart is empty</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CartItemProps {
  item: {
    id: string;
    track: {
      title: string;
      cover_art?: string | null;
    };
    licenseType: License | string;
    price: number;
  };
  coverArtUrl: string;
  onRemove: () => void;
}

const CartItem = React.memo(function CartItem({
  item,
  coverArtUrl,
  onRemove,
}: CartItemProps) {
  const finalCoverArtUrl = coverArtUrl || "/images/default-cover.jpg";

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 relative flex-shrink-0 bg-neutral-800 rounded overflow-hidden">
        <Image
          src={finalCoverArtUrl}
          alt={item.track.title}
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
        <h4 className="font-medium truncate">{item.track.title}</h4>
        <p className="text-sm text-gray-400">{item.licenseType.toString()}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium">${item.price}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
