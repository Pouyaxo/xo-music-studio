"use client";

import React from "react";
import { DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

interface CartTriggerProps {
  itemCount: number;
  total: number;
}

export const CartTrigger = React.memo(function CartTrigger({
  itemCount,
  total,
}: CartTriggerProps) {
  return (
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
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-white lg:block hidden">
          ${total.toFixed(2)}
        </span>
      </button>
    </DropdownMenuTrigger>
  );
});
