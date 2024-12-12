"use client";

import React from "react";
import { useDataStore } from "@/lib/store/dataStore";
import type { Track } from "@/lib/types/audioTypes";
import { TrackRow } from "./TrackRow";
import { useAudioContext } from "@/lib/context/AudioContext";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { getAudioDuration, formatDuration } from "@/lib/utils/audioUtils";

interface PlaylistProps {
  initialData: {
    tracks: Track[];
    licenses?: any[];
    soundKits?: any[];
  };
}

export function Playlist({ initialData }: PlaylistProps) {
  const { handleTrackClick, currentTrack, setPlaylist } = useAudioContext();
  const tracks = initialData.tracks;
  const error = useDataStore((state) => state.error.tracks);
  const [durations, setDurations] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (tracks.length > 0) {
      setPlaylist(tracks);

      tracks.forEach(async (track) => {
        const audioFile =
          track.tagged_mp3 ||
          track.untagged_mp3 ||
          track.tagged_wav ||
          track.untagged_wav;

        if (audioFile) {
          try {
            const audioUrl = getStorageUrl(audioFile);
            const duration = await getAudioDuration(audioUrl);
            setDurations((prev) => ({
              ...prev,
              [track.id]: formatDuration(duration),
            }));
          } catch (err) {
            console.error("Error getting duration for track:", track.id, err);
            setDurations((prev) => ({
              ...prev,
              [track.id]: "0:00",
            }));
          }
        }
      });
    }
  }, [tracks, setPlaylist]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="block mx-auto mt-4 text-white hover:text-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="grid grid-cols-[48px,2fr,0.5fr,0.5fr,0.5fr,2.5fr] gap-5 px-4 py-3 text-[12px] uppercase tracking-wider font-medium text-neutral-500">
            <div></div>
            <div className="flex items-center">TITLE</div>
            <div className="flex items-center justify-center">TIME</div>
            <div className="flex items-center justify-center">BPM</div>
            <div className="flex items-center">TAGS</div>
            <div></div>
          </div>
          <div className="playlist-container">
            <div className="flex flex-col gap-2 pb-24">
              {tracks.map((track) => (
                <div key={track.id} className="playlist-row">
                  <TrackRow
                    track={track}
                    isActive={currentTrack?.id === track.id}
                    duration={durations[track.id] || "0:00"}
                    onClick={() => handleTrackClick(track)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
