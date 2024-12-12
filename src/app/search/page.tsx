"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import { TrackRow } from "@/components/audio/playlist/TrackRow";
import { BottomPlayer } from "@/components/audio/player/BottomPlayer";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchContent() {
      if (!query) return;

      setLoading(true);
      try {
        console.log("Starting search for:", query);

        // Simple direct query first to test
        const { data: tracksData, error } = await supabase
          .from("tracks")
          .select("*")
          .ilike("title", `%${query}%`)
          .limit(50);

        console.log("Raw response:", { data: tracksData, error });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Setting tracks:", tracksData);
        setTracks(tracksData || []);
      } catch (error) {
        console.error("Search error:", error);
        setTracks([]); // Ensure we clear results on error
      } finally {
        setLoading(false);
      }
    }

    searchContent();
  }, [query]);

  // Debug render
  console.log("Rendering with:", {
    query,
    loading,
    tracksCount: tracks.length,
  });

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32 flex-1">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Search Results for "{query}"
          </h1>

          {loading ? (
            <div className="text-white text-center">Searching...</div>
          ) : tracks.length > 0 ? (
            <div className="space-y-4">
              {tracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={{
                    id: track.id,
                    title: track.title,
                    cover_art: track.cover_art,
                    bpm: track.bpm,
                    tags: track.tags,
                    allow_download: track.allow_download,
                    artist: track.artist,
                    track_type: track.track_type,
                    social_platforms: track.social_platforms || [],
                    related_videos: track.related_videos || [],
                    not_for_sale: track.not_for_sale || false,
                    private: track.private || false,
                    exclude_bulk_discount: track.exclude_bulk_discount || false,
                    user_id: track.user_id,
                    track_id: track.track_id,
                  }}
                  isActive={false}
                  duration={track.duration || "0:00"}
                  onClick={() => {
                    console.log("Track clicked:", track);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-white text-center py-12">
              No results found for "{query}"
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomPlayer />
    </div>
  );
}
