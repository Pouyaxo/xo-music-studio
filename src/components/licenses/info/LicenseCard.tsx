"use client";

import React from "react";
import { Star } from "lucide-react";

interface LicenseCardProps {
  title: string;
  price: string | number;
  isPopular?: boolean;
  features: string[];
  savings: string;
}

export function LicenseCard({
  title,
  price,
  isPopular,
  features,
  savings,
}: LicenseCardProps) {
  const isOffer = title === "EXCLUSIVE";

  return (
    <div className="relative w-[400px] h-fit min-h-[600px]">
      <div className={`relative license-card-wrapper ${isPopular ? "featured-license" : ""}`}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-white text-black px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              POPULAR
            </div>
          </div>
        )}

        <div
          className={`
            relative overflow-hidden
            bg-black rounded-[32px] p-10 
            flex flex-col 
            ${isPopular ? "border-2 border-white" : "border border-zinc-800"}
          `}
        >
          {/* Moving light effect - only shown on popular card */}
          {isPopular && (
            <div
              className="absolute top-0 -left-[100%] w-[150%] h-[100%] 
                bg-gradient-to-r from-transparent via-white/[0.15] to-transparent
                animate-card-shine pointer-events-none"
              style={{
                transform: "skewX(-20deg)",
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-20">
            {/* Header */}
            <div className="text-center mb-10">
              <h3 className="text-white/60 text-2xl font-medium mb-4">{title}</h3>
              <div className="text-white text-[42px] font-bold">
                {isOffer ? (
                  <span className="text-3xl">MAKE AN OFFER</span>
                ) : (
                  price
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" />
                  <span className="text-white/60 text-[15px] leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8">
              <button
                className={`
                  w-full rounded-full py-3 font-medium mb-6
                  ${
                    isPopular
                      ? "bg-white text-black"
                      : "bg-zinc-800 text-white/60"
                  }
                `}
              >
                READ LICENSE
              </button>

              <div className="text-center">
                <div className="text-white/40 text-sm mb-1">Bulk deals:</div>
                <div className="text-white font-bold">{savings}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
