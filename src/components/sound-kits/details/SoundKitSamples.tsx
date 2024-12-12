"use client";

import React, { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { getStorageUrl } from "@/lib/utils/storageUtils";

interface Sample {
  id: string;
  name: string;
  url: string;
  duration?: string;
  type?: string;
  bpm?: number;
  key?: string;
}

interface SoundKitSamplesProps {
  samples: Sample[];
}

export function SoundKitSamples({ samples }: SoundKitSamplesProps) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (index: number, previewUrl?: string) => {
    if (!previewUrl) return;

    if (playingId === index) {
      // Stop playing
      audio?.pause();
      setPlayingId(null);
      setAudio(null);
    } else {
      // Stop previous audio if any
      audio?.pause();

      // Play new audio
      const newAudio = new Audio(getStorageUrl(previewUrl));
      newAudio.play();
      newAudio.onended = () => {
        setPlayingId(null);
        setAudio(null);
      };

      setPlayingId(index);
      setAudio(newAudio);
    }
  };

  if (!samples || samples.length === 0) {
    return (
      <div className="bg-[#111111] rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Sample Preview</h2>
        <p className="text-gray-400">No samples available for preview</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Sample Preview</h2>
      <div className="space-y-2">
        {samples.map((sample, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
          >
            <button
              onClick={() => handlePlay(index, sample.url)}
              className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              disabled={!sample.url}
            >
              {playingId === index ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{sample.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{sample.duration}</span>
                {sample.type && (
                  <>
                    <span>•</span>
                    <span>{sample.type}</span>
                  </>
                )}
                {sample.bpm && (
                  <>
                    <span>•</span>
                    <span>{sample.bpm} BPM</span>
                  </>
                )}
                {sample.key && (
                  <>
                    <span>•</span>
                    <span>Key: {sample.key}</span>
                  </>
                )}
              </div>
            </div>

            {!sample.url && (
              <div className="text-sm text-gray-500">No preview</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
