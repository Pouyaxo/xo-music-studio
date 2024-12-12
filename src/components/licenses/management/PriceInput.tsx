"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export function PriceInput({
  value,
  onChange,
  onBlur,
  className,
}: PriceInputProps) {
  const increment = () => {
    const currentValue = parseFloat(value) || 0;
    onChange((currentValue + 1).toString());
  };

  const decrement = () => {
    const currentValue = parseFloat(value) || 0;
    onChange(Math.max(0, currentValue - 1).toString());
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className=" h-[33px] relative flex items-center bg-zinc-900/50 rounded-lg border border-white/10">
        <span className="pl-3 text-zinc-400">$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="w-[100px] h-8 bg-transparent pl-1 pr-8 text-white focus:outline-none" // Increased from w-[80px] to w-[100px]
        />
        <div className="absolute right-1 inset-y-0 flex flex-col justify-center">
          <button
            onClick={increment}
            className="h-3 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={decrement}
            className="h-3 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button
        onClick={onBlur}
        className="h-8 ml-2 px-3 bg-zinc-900/50 text-white rounded-lg text-sm font-medium border border-white/10 hover:bg-white/5 transition-colors"
      >
        Apply
      </button>
    </div>
  );
}
