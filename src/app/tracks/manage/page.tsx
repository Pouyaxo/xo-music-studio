"use client";

import { useState, useEffect } from "react";
import { ManagementLayout } from "@/components/management/Layout";
import { TrackList } from "@/components/tracks/management/TrackList";
import { TrackMetadataEditor } from "@/components/tracks/management/MetadataEditor";
import { useDataStore } from "@/lib/store/dataStore";
import type { Track } from "@/lib/types/audioTypes";

export default function TrackManagementPage() {
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showNewTrack, setShowNewTrack] = useState(false);
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData("tracks");
  }, [fetchData]);

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
  };

  const handleBack = () => {
    setEditingTrack(null);
    setShowNewTrack(false);
  };

  const handleNewTrack = () => {
    setShowNewTrack(true);
  };

  if (editingTrack || showNewTrack) {
    return (
      <TrackMetadataEditor editingTrack={editingTrack} onBack={handleBack} />
    );
  }

  return (
    <ManagementLayout
      title="Track Management"
      onAdd={handleNewTrack}
      addButtonLabel="Add New Track"
    >
      <TrackList onEditTrack={handleEditTrack} onNewTrack={handleNewTrack} />
    </ManagementLayout>
  );
}
