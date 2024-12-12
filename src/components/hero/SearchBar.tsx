"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Music, Package } from "lucide-react";
import { useSearchStore } from "@/lib/store/searchStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";

interface SearchSuggestion {
  id: string;
  title: string;
  type: "track" | "soundkit";
}

export function SearchBar() {
  const { isOpen, searchQuery, setIsOpen, setSearchQuery } = useSearchStore();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        // Fetch tracks
        const { data: tracks } = await supabase
          .from("tracks")
          .select("id, title")
          .ilike("title", `%${searchQuery}%`)
          .limit(3);

        // Fetch sound kits
        const { data: soundKits } = await supabase
          .from("sound_kits")
          .select("id, title")
          .ilike("title", `%${searchQuery}%`)
          .limit(2);

        const formattedTracks = (tracks || []).map((track) => ({
          id: track.id,
          title: track.title,
          type: "track" as const,
        }));

        const formattedKits = (soundKits || []).map((kit) => ({
          id: kit.id,
          title: kit.title,
          type: "soundkit" as const,
        }));

        setSuggestions([...formattedTracks, ...formattedKits]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    // Only fetch if search query exists
    if (searchQuery) {
      const timer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[60] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 animate-fadeIn">
        <form onSubmit={handleSearch}>
          <div className="bg-[#111111] rounded-[28px] border border-zinc-800/50 transition-all duration-200 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center">
              <button
                className="ml-6 text-zinc-500 hover:text-white transition-colors"
                type="submit"
              >
                <Search className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                }}
                placeholder="Search tracks or sound kits..."
                className="w-full h-[52px] px-4 bg-transparent text-white focus:outline-none"
                autoFocus
              />

              <button
                type="button"
                onClick={closeSearch}
                className="px-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions */}
            {(suggestions.length > 0 ||
              (searchQuery.trim().length >= 2 && suggestions.length === 0)) && (
              <>
                <div className="h-px bg-zinc-800/50" />
                <div>
                  {suggestions.map((suggestion) => (
                    <Link
                      key={`${suggestion.type}-${suggestion.id}`}
                      href={`/${suggestion.type}s/${suggestion.id}`}
                      onClick={closeSearch}
                      className="w-full px-6 py-3 text-left hover:bg-white/5 flex items-center gap-3 group transition-colors"
                    >
                      <div className="text-zinc-400 group-hover:text-white transition-colors">
                        {suggestion.type === "track" ? (
                          <Music className="w-4 h-4" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover:underline">
                          {suggestion.title}
                        </p>
                        <p className="text-zinc-500 text-xs capitalize">
                          {suggestion.type}
                        </p>
                      </div>
                    </Link>
                  ))}

                  {searchQuery.trim().length >= 2 &&
                    suggestions.length === 0 && (
                      <div className="px-6 py-4 text-zinc-500 text-sm">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                </div>
              </>
            )}

            {searchQuery.trim().length >= 2 && suggestions.length > 0 && (
              <>
                <div className="h-px bg-zinc-800/50" />
                <button
                  onClick={handleSearch}
                  className="w-full py-3 px-6 text-sm text-zinc-400 hover:bg-white/5 text-left transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
