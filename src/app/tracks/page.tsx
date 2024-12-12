"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TrackHeader } from "@/components/tracks/details/TrackHeader";
import { TrackComments } from "@/components/tracks/details/TrackComments";
import { RelatedTracks } from "@/components/tracks/details/RelatedTracks";
import { TrackCollaborators } from "@/components/tracks/details/TrackCollaborators";
import { BottomPlayer } from "@/components/audio/player/BottomPlayer";
import { Navbar } from "@/components/layout/Navbar";
import { LicenseModal } from "@/components/licenses/modal/LicenseModal";
import { supabase } from "@/lib/supabase/supabaseClient";
import type { Track } from "@/lib/types/audioTypes";

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setTracks(data as Track[]);
    };

    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-32">
        {/* Your tracks listing UI here */}
      </main>
      <BottomPlayer />
    </div>
  );
}
