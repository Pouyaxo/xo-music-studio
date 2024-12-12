"use client";

import React from "react";

interface SoundKitDescriptionProps {
  description?: string;
}

export function SoundKitDescription({ description }: SoundKitDescriptionProps) {
  if (!description) return null;

  return (
    <div className="bg-[#111111] rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Description</h2>
      <p className="text-white/80 whitespace-pre-wrap">{description}</p>
    </div>
  );
}
