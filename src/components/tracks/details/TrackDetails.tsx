"use client";

import React, { useState } from "react";
import { TrackHeader } from "./TrackHeader";
import { TrackCollaborators } from "./TrackCollaborators";
import { TrackComments } from "./TrackComments";
import { RelatedTracks } from "./RelatedTracks";
import type { Track } from "@/lib/types/audioTypes";
import { LicenseModal } from "@/components/licenses/modal/LicenseModal";

interface TrackDetailsProps {
  track: Track;
}

export function TrackDetails({ track }: TrackDetailsProps) {
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  return (
    <div className="flex-1">
      <TrackHeader
        track={track}
        onLicenseClick={() => setShowLicenseModal(true)}
      />

      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 px-8 lg:px-24 py-12">
          {/* Main Content */}
          <div className="space-y-12">
            <TrackCollaborators collaborators={track.collaborators} />
            <TrackComments trackId={track.id} />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="space-y-8 sticky top-24">
              {/* Track Details Card */}
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h3 className="font-medium mb-4">Track Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">BPM</span>
                    <span>{track.bpm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Key</span>
                    <span>{track.key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span>{track.duration || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Related Tracks */}
              <RelatedTracks currentTrackId={track.id} />
            </div>
          </aside>
        </div>
      </div>

      <LicenseModal
        track={track}
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
      />
    </div>
  );
}
