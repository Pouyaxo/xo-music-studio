"use client";

import { useState, useEffect } from "react";
import { ManagementLayout } from "@/components/management/Layout";
import { SoundKitsList } from "@/components/sound-kits/management/SoundKitsList";
import { SoundKitEditor } from "@/components/sound-kits/management/SoundKitEditor";
import { useDataStore } from "@/lib/store/dataStore";
import type { SoundKit } from "@/lib/types/soundKitTypes";

export default function SoundKitsManagementPage() {
  const [editingKit, setEditingKit] = useState<SoundKit | undefined>(undefined);
  const [showNewKit, setShowNewKit] = useState(false);
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    // Pre-fetch sound kits data on component mount
    fetchData("soundKits");
  }, [fetchData]);

  const handleEditKit = (kit: SoundKit) => {
    setEditingKit(kit);
  };

  const handleBack = () => {
    setEditingKit(undefined);
    setShowNewKit(false);
  };

  const handleNewKit = () => {
    setShowNewKit(true);
  };

  if (editingKit || showNewKit) {
    return <SoundKitEditor editingKit={editingKit} onBack={handleBack} />;
  }

  return (
    <ManagementLayout
      title="Sound Kit Management"
      onAdd={handleNewKit}
      addButtonLabel="Add New Sound Kit"
    >
      <SoundKitsList onEditKit={handleEditKit} onNewKit={handleNewKit} />
    </ManagementLayout>
  );
}
