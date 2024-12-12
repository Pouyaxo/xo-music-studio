"use client";

import { Search } from "lucide-react";

export function BeatsSearch() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="What type of track are you looking for?"
        className="w-full h-14 pl-12 pr-4 rounded-lg bg-[#111111] border border-[#222222] text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
}