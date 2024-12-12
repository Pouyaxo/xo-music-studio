"use client";

import { useState } from "react";
import { CustomSelect } from "@/components/ui/Select";

export function BeatsFilters() {
  const [category, setCategory] = useState("all");
  const [bpm, setBpm] = useState("all");
  const [mood, setMood] = useState("all");
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [view, setView] = useState("list");

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <CustomSelect
        value={category}
        onValueChange={setCategory}
        options={[
          { label: "All Category", value: "all" },
          { label: "Beats with Hook", value: "with-hook" },
          { label: "Beats", value: "beats" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />

      <CustomSelect
        value={bpm}
        onValueChange={setBpm}
        options={[
          { label: "All BPM", value: "all" },
          { label: "80-90", value: "80-90" },
          { label: "90-100", value: "90-100" },
          { label: "100-110", value: "100-110" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />

      <CustomSelect
        value={mood}
        onValueChange={setMood}
        options={[
          { label: "All Moods", value: "all" },
          { label: "Dark", value: "dark" },
          { label: "Chill", value: "chill" },
          { label: "Energetic", value: "energetic" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />

      <CustomSelect
        value={genre}
        onValueChange={setGenre}
        options={[
          { label: "All Genres", value: "all" },
          { label: "Trap", value: "trap" },
          { label: "Hip Hop", value: "hip-hop" },
          { label: "R&B", value: "rnb" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />

      <CustomSelect
        value={sortBy}
        onValueChange={setSortBy}
        options={[
          { label: "Default", value: "default" },
          { label: "Newest", value: "newest" },
          { label: "Price: Low to High", value: "price-asc" },
          { label: "Price: High to Low", value: "price-desc" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />

      <CustomSelect
        value={view}
        onValueChange={setView}
        options={[
          { label: "Default List", value: "list" },
          { label: "Grid View", value: "grid" },
        ]}
        className="bg-[#111111] border-[#222222] text-white"
      />
    </div>
  );
}
