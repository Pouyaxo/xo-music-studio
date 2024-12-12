"use client";

import React, { useState } from "react";
import { Track } from "@/lib/types/audioTypes";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { LicenseFeatures } from "./LicenseFeatures";
import { useDataStore } from "@/lib/store/dataStore";

interface LicenseOptionsProps {
  track: Track;
  onClose: () => void;
}

export function LicenseOptions({ track, onClose }: LicenseOptionsProps) {
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const licenses = useDataStore((state) => state.licenses);

  const handleLicenseClick = (licenseType: string, price: number) => {
    if (!isInCart(track.id, licenseType, "beat")) {
      addToCart({
        id: `${track.id}-${licenseType}`,
        track,
        licenseType,
        price,
        productType: "beat",
      });
      onClose();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {licenses.map((license) => {
        const inCart = isInCart(track.id, license.name, "beat");

        return (
          <div
            key={license.id}
            className="bg-[#111111] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div>
                <h4 className="font-bold text-xl text-white">{license.name}</h4>
                <p className="text-sm text-gray-400">{license.type}</p>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() =>
                    handleLicenseClick(license.name, license.price)
                  }
                  className={`
                    h-10 px-6 rounded-full font-medium transition-colors
                    ${
                      inCart
                        ? "bg-[#333333] text-white cursor-default"
                        : "bg-white text-black hover:bg-gray-200 cursor-pointer"
                    }
                  `}
                >
                  {inCart ? "IN CART" : `$${license.price}`}
                </button>
                <button
                  onClick={() =>
                    setExpandedLicense(
                      expandedLicense === license.name ? null : license.name
                    )
                  }
                  className="text-gray-400 hover:text-white p-2 w-full flex items-center justify-center"
                >
                  {expandedLicense === license.name ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {expandedLicense === license.name && (
              <LicenseFeatures features={license.features || []} />
            )}
          </div>
        );
      })}
    </div>
  );
}
