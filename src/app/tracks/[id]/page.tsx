"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TrackHeader } from "@/components/tracks/details/TrackHeader";
import { TrackDescription } from "@/components/tracks/details/TrackDescription";
import { TrackComments } from "@/components/tracks/details/TrackComments";
import { RelatedTracks } from "@/components/tracks/details/RelatedTracks";
import { TrackCollaborators } from "@/components/tracks/details/TrackCollaborators";
import { BottomPlayer } from "@/components/audio/player/BottomPlayer";
import { Navbar } from "@/components/layout/Navbar";
import { LicenseModal } from "@/components/licenses/modal/LicenseModal";
import { supabase } from "@/lib/supabase/supabaseClient";
import { CartProvider } from "@/lib/context/CartContext";
import { AudioProvider } from "@/lib/context/AudioContext";
import type { Track } from "@/lib/types/audioTypes";

export default function TrackDetailsPage() {
  const params = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"related" | "comments">("related");

  useEffect(() => {
    const fetchTrack = async () => {
      if (!params?.id) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("tracks")
          .select("*")
          .eq("id", params.id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Track not found");

        const trackData = {
          ...data,
          user_id: data.user_id || "",
          collaborators: Array.isArray(data.collaborators)
            ? data.collaborators
            : null,
        } as Track;

        setTrack(trackData);
      } catch (err) {
        console.error("Error fetching track:", err);
        setError(err instanceof Error ? err.message : "Failed to load track");
      }
    };

    fetchTrack();
  }, [params?.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-white bg-zinc-900/50 px-6 py-4 rounded-lg border border-white/10">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return null;
  }

  return (
    <AudioProvider>
      <CartProvider>
        <div className="min-h-screen bg-black">
          <Navbar />

          <main>
            <TrackHeader
              track={track}
              onLicenseClick={() => setShowLicenseModal(true)}
            />

            <div className="max-w-screen-2xl mx-auto px-24">
              {/* Comments Section */}
              <div className="mt-16">
                <TrackComments trackId={track.id} />
              </div>

              {/* Collaborators Section */}
              <div className="mt-16">
                <TrackCollaborators collaborators={track.collaborators} />
              </div>
            </div>

            {/* Tabs and Related Tracks/Comments */}
            <div className="mt-16 border-t border-white/10">
              <div className="max-w-screen-2xl mx-auto px-24">
                <div className="flex justify-center gap-8 pt-8">
                  <button
                    className={`pb-4 ${
                      activeTab === "related"
                        ? "text-white font-medium border-b-2 border-white"
                        : "text-white/60"
                    }`}
                    onClick={() => setActiveTab("related")}
                  >
                    RELATED TRACKS
                  </button>
                  <button
                    className={`pb-4 ${
                      activeTab === "comments"
                        ? "text-white font-medium border-b-2 border-white"
                        : "text-white/60"
                    }`}
                    onClick={() => setActiveTab("comments")}
                  >
                    COMMENTS
                  </button>
                </div>

                <div className="pb-32">
                  {activeTab === "related" ? (
                    <RelatedTracks currentTrackId={track.id} />
                  ) : (
                    <div className="py-8">
                      {/* Additional comments content */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          <BottomPlayer />

          <LicenseModal
            track={track}
            isOpen={showLicenseModal}
            onClose={() => setShowLicenseModal(false)}
          />
        </div>
      </CartProvider>
    </AudioProvider>
  );
}
