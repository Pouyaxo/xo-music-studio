import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BeatsHeader } from "@/components/tracks/list/ListHeader";
import { BeatsFilters } from "@/components/tracks/filters/TrackFilters";
import { BeatsSearch } from "@/components/tracks/filters/SearchBar";
import { BeatsTable } from "@/components/tracks/list/TrackList";
import { BottomPlayer } from "@/components/audio/player/BottomPlayer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Track } from "@/lib/types/audioTypes";

async function getData() {
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  return { tracks: tracks || [] };
}

export default async function BeatsPage() {
  const { tracks } = await getData();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <BeatsHeader />
        <div className="space-y-6">
          <BeatsFilters />
          <BeatsSearch />
          <Suspense fallback={null}>
            <BeatsTable initialData={tracks as unknown as Track[]} />
          </Suspense>
        </div>
      </main>
      <BottomPlayer />
    </div>
  );
}
