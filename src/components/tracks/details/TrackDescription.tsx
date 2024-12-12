"use client";

import React from 'react';

interface TrackDescriptionProps {
  description: string;
}

export function TrackDescription({ description }: TrackDescriptionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-white/80">{description}</p>
    </div>
  );
}