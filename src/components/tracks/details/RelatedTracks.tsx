"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Track } from "@/lib/types/audioTypes";
import { Playlist } from "@/components/audio/playlist/PlaylistView";

interface RelatedTracksProps {
  currentTrackId: string;
}

export function RelatedTracks({ currentTrackId }: RelatedTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both tracks and licenses in parallel
        const [tracksResponse, licensesResponse] = await Promise.all([
          supabase
            .from("tracks")
            .select("*")
            .neq("id", currentTrackId)
            .limit(5),
          supabase
            .from("licenses")
            .select("*")
            .order("order", { ascending: true }),
        ]);

        if (tracksResponse.error) throw tracksResponse.error;
        if (licensesResponse.error) throw licensesResponse.error;

        const formattedTracks =
          tracksResponse.data?.map((track) => ({
            ...track,
            release_date: track.release_date?.toString(),
            user_id: track.user_id || "",
          })) || [];

        setTracks(formattedTracks);
        setLicenses(licensesResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load related tracks");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentTrackId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="text-white">Loading related tracks...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-white mb-6">Related Tracks</h2>
      <Playlist
        initialData={{
          tracks,
          licenses,
          soundKits: [], // Adding empty soundKits array as it's expected by the component
        }}
      />
    </div>
  );
}
