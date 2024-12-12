"use client";

import React from "react";
import { SoundKitHeader } from "./SoundKitHeader";
import { SoundKitCollaborators } from "./SoundKitCollaborators";
import { SoundKitComments } from "./SoundKitComments";
import type { SoundKit } from "@/lib/types/soundKitTypes";

interface SoundKitDetailsProps {
  soundKit: SoundKit;
}

export function SoundKitDetails({ soundKit }: SoundKitDetailsProps) {
  return (
    <div className="flex-1">
      <SoundKitHeader soundKit={soundKit} />

      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 px-24 py-12">
          {/* Main Content */}
          <div className="space-y-12">
            <SoundKitCollaborators
              collaborators={soundKit.collaborators.map((name) => ({
                id: name,
                name: name,
              }))}
            />
            <SoundKitComments soundKitId={soundKit.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 mt-[48px]">
            {/* Kit Details Card */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="font-medium mb-4">Kit Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span>{soundKit.format || "WAV"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span>{soundKit.size || "0 MB"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Samples</span>
                  <span>{soundKit.samples?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Features Card */}
            {soundKit.features && soundKit.features.length > 0 && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h3 className="font-medium mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {soundKit.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-white">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
