"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import type { SoundKit } from "@/lib/types/soundKitTypes";
import { STORAGE_BUCKETS } from "@/lib/utils/storageUtils";

interface Props {
  onEditKit: (kit: SoundKit) => void;
  onNewKit: () => void;
}

export function SoundKitsList({ onEditKit, onNewKit }: Props) {
  const [selectedKits, setSelectedKits] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<SoundKit | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const soundKits = useDataStore((state) => state.soundKits);
  const error = useDataStore((state) => state.error.soundKits);
  const fetchData = useDataStore((state) => state.fetchData);
  const invalidateData = useDataStore((state) => state.invalidateData);

  const handleDeleteClick = (kit: SoundKit) => {
    setKitToDelete(kit);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const deleteKitFiles = async (kit: SoundKit) => {
    if (!kit.id) return;

    try {
      // Collect all kit IDs from file paths
      const kitIds = new Set<string>();
      kitIds.add(kit.id);

      [kit.sound_kit_file, kit.preview_file, kit.cover_art]
        .filter(Boolean)
        .forEach((path) => {
          if (path) {
            const pathParts = path.split("/");
            if (pathParts.length >= 4) {
              kitIds.add(pathParts[2]);
            }
          }
        });

      const buckets = [
        STORAGE_BUCKETS.SOUND_KITS,
        STORAGE_BUCKETS.SOUND_KIT_PREVIEWS,
        STORAGE_BUCKETS.SOUND_KITS_COVERS, // Add covers bucket back
      ];

      for (const bucket of buckets) {
        for (const kitId of Array.from(kitIds)) {
          try {
            const folderPath = `${kit.user_id}/${kitId}`;

            const { data: files, error: listError } = await supabase.storage
              .from(bucket)
              .list(folderPath);

            if (listError) {
              console.error(
                `Error listing files in ${bucket}/${folderPath}:`,
                listError
              );
              continue;
            }

            if (files && files.length > 0) {
              const filePaths = files.map(
                (file) => `${folderPath}/${file.name}`
              );

              const { error: deleteError } = await supabase.storage
                .from(bucket)
                .remove(filePaths);

              if (deleteError) {
                console.error(
                  `Error deleting files from ${bucket}/${folderPath}:`,
                  deleteError
                );
              }
            }
          } catch (error) {
            console.error(`Error processing ${bucket}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in deleteKitFiles:", error);
    }
  };

  const deleteKit = async (kit: SoundKit) => {
    try {
      await deleteKitFiles(kit);

      const { error: deleteError } = await supabase
        .from("sound_kits")
        .delete()
        .eq("id", kit.id);

      if (deleteError) throw deleteError;

      toast.success("Sound kit deleted successfully", {
        style: {
          background: "rgba(22, 101, 52, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          color: "#fff",
        },
      });

      invalidateData("soundKits");
      await fetchData("soundKits", true);
    } catch (error) {
      console.error("Error deleting sound kit:", error);
      toast.error("Failed to delete sound kit", {
        style: {
          background: "rgba(153, 27, 27, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#fff",
        },
      });
    }
  };

  const deleteSelectedKits = async () => {
    try {
      const kitsToDelete = soundKits.filter((kit) =>
        selectedKits.includes(kit.id)
      );

      await Promise.all(kitsToDelete.map((kit) => deleteKitFiles(kit)));

      const { error: deleteError } = await supabase
        .from("sound_kits")
        .delete()
        .in("id", selectedKits);

      if (deleteError) throw deleteError;

      toast.success("Selected sound kits deleted successfully", {
        style: {
          background: "rgba(22, 101, 52, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          color: "#fff",
        },
      });

      setSelectedKits([]);
      invalidateData("soundKits");
      await fetchData("soundKits", true);
    } catch (error) {
      console.error("Error deleting sound kits:", error);
      toast.error("Failed to delete selected sound kits", {
        style: {
          background: "rgba(153, 27, 27, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#fff",
        },
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-200 text-black rounded-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (soundKits.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="mb-4">No sound kits available</p>
        <Button
          onClick={onNewKit}
          className="bg-white hover:bg-gray-200 text-black rounded-full"
        >
          Add Your First Sound Kit
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      <div className="text-[12px] uppercase tracking-wider font-medium text-neutral-500 mb-2">
        <div className="grid grid-cols-[24px,10px,0.5fr,3fr,120px] gap-2 px-4">
          <div></div>
          <div className="flex items-center justify-center">
            <div className="w-4 h-4" />
          </div>
          <div className="flex items-center truncate">TITLE</div>
          <div className="flex items-center">PRICE</div>
          <div></div>
        </div>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col">
          {soundKits.map((kit) => (
            <div
              key={kit.id}
              className="h-[70px] grid grid-cols-[24px,10px,0.5fr,3fr,120px] gap-2 px-4 items-center hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedKits.includes(kit.id)}
                  onCheckedChange={() => {
                    setSelectedKits((prev) =>
                      prev.includes(kit.id)
                        ? prev.filter((id) => id !== kit.id)
                        : [...prev, kit.id]
                    );
                  }}
                />
              </div>
              <div></div>

              <div className="flex items-center text-[14px] text-white truncate">
                {kit.title}
              </div>

              <div className="flex items-center text-[14px] text-zinc-400">
                ${kit.price}
              </div>

              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onEditKit(kit)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-white hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => handleDeleteClick(kit)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedKits.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
          <Check className="w-4 h-4" />
          <span>{selectedKits.length} selected</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedKits(soundKits.map((kit) => kit.id))}
            className="text-black hover:text-black/50"
          >
            Select All
          </Button>

          <div className="h-4 w-px bg-black/20" />

          <button
            onClick={() => setBulkDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setKitToDelete(null);
        }}
        onConfirm={() => {
          if (kitToDelete) {
            deleteKit(kitToDelete);
            setDeleteDialogOpen(false);
            setKitToDelete(null);
          }
        }}
        title="Delete Sound Kit"
        description="Are you sure you want to delete this sound kit? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteSelectedKits();
          setBulkDeleteDialogOpen(false);
        }}
        title="Delete Selected Sound Kits"
        description={`Are you sure you want to delete ${selectedKits.length} sound kits? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
