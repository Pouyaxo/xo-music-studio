"use client";

import { useEffect } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { TrackRow } from "@/components/audio/playlist/TrackRow";
import { useAudioContext } from "@/lib/context/AudioContext";
import type { Track } from "@/lib/types/audioTypes";

interface BeatsTableProps {
  initialData: Track[];
}

export function BeatsTable({ initialData }: BeatsTableProps) {
  const { handleTrackClick, currentTrack } = useAudioContext();
  const tracks = useDataStore((state) => state.tracks);
  const error = useDataStore((state) => state.error.tracks);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-white hover:text-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="grid grid-cols-[48px,2fr,0.5fr,0.5fr,0.5fr,2.5fr] gap-5 px-4 py-3 text-[12px] uppercase tracking-wider font-medium text-neutral-500">
        <div></div>
        <div className="flex items-center">TITLE</div>
        <div className="flex items-center justify-center">TIME</div>
        <div className="flex items-center justify-center">BPM</div>
        <div className="flex items-center justify-center">TAGS</div>
        <div></div>
      </div>
      <div className="flex flex-col gap-2">
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            isActive={currentTrack?.id === track.id}
            duration="0:00"
            onClick={() => handleTrackClick(track)}
          />
        ))}
      </div>
    </div>
  );
}
