"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { SoundKitCard } from "./SoundKitCard";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SoundKitsSection() {
  const [showAll, setShowAll] = useState(false);
  const soundKits = useDataStore((state) => state.soundKits);
  const error = useDataStore((state) => state.error.soundKits);
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData("soundKits");
  }, [fetchData]);

  // Show only first 4 items if showAll is false
  const displayedSoundKits = showAll ? soundKits : soundKits.slice(0, 4);

  if (error) {
    return (
      <div className="text-center text-red-500">
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
    <div className="mb-12 mt-12">
      <h2 className="text-4xl font-bold text-center text-white mb-16">
        Sound Kits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedSoundKits.map((soundKit) => (
          <SoundKitCard key={soundKit.id} soundKit={soundKit} />
        ))}
      </div>

      {soundKits.length > 4 && (
        <div className="mt-16 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-full transition-colors inline-flex items-center gap-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Browse All Sound Kits <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {soundKits.length === 0 && (
        <div className="text-center text-gray-400">No sound kits available</div>
      )}
    </div>
  );
}
