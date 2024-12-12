"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { FeaturedTrack } from "./FeaturedTrack";
import { useAudioContext } from "@/lib/context/AudioContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import type { Track } from "@/lib/types/audioTypes";
import { Mesh, Points } from "three";
import gsap from "gsap";

// Dynamically import Three.js components with no SSR
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

export function HeroSection() {
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { handleTrackClick, isPlaying, currentTrack } = useAudioContext();

  useEffect(() => {
    const fetchFeaturedTrack = async () => {
      try {
        const { data, error } = await supabase
          .from("tracks")
          .select("*")
          .eq("is_featured", true)
          .maybeSingle();

        if (error) throw error;
        setFeaturedTrack(data as Track | null);
      } catch (err) {
        console.error("Error fetching featured track:", err);
        setError("Failed to load featured track");
      }
    };

    fetchFeaturedTrack();
  }, []);

  return (
    <div className="relative min-h-[850px] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-[400px] animate-fadeIn">
        {/* Featured Track */}
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          featuredTrack && (
            <div className="w-full max-w-3xl mx-auto">
              <FeaturedTrack
                track={featuredTrack}
                isPlaying={isPlaying && currentTrack?.id === featuredTrack.id}
                onPlay={() => handleTrackClick(featuredTrack)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
