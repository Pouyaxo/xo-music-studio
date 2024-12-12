"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardSliderProps {
  children: React.ReactNode[];
}

export function CardSlider({ children }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3; // Number of cards to show at once

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < children.length - cardsPerView;

  const handlePrevious = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-6"
          style={{ transform: `translateX(-${currentIndex * (400 + 24)}px)` }}
        >
          {children}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={handlePrevious}
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={handleNext}
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
