"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { Pencil, Trash2, Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableLicenseRow } from "./SortableLicenseRow";
import type { License } from "@/lib/types/licenseTypes";

interface Props {
  onEditLicense: (license: License) => void;
  onNewLicense: () => void;
}

const getLicensePriceColumn = (licenseType: string) => {
  // Convert to lowercase and remove any extra spaces
  const type = licenseType.toLowerCase().trim();

  switch (type) {
    case "mp3 lease":
      return "mp3_license_price";
    case "wav lease":
      return "wav_license_price";
    case "wav trackout":
      return "stems_license_price";
    case "unlimited":
    case "unlimited use":
      return "unlimited_license_price";
    default:
      console.warn(`Unknown license type: ${licenseType}`);
      return "mp3_license_price"; // Fallback to mp3 price
  }
};

export function LicensesList({ onEditLicense, onNewLicense }: Props) {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const { licenses, error, invalidateData, fetchData } = useDataStore();
  const setData = useDataStore((state) => state.setData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = licenses.findIndex(
        (license) => license.id === active.id
      );
      const newIndex = licenses.findIndex((license) => license.id === over.id);

      // Immediately update UI with new order
      const newLicenses = arrayMove([...licenses], oldIndex, newIndex);
      setData("licenses", newLicenses);

      try {
        // Update orders in database
        const updates = newLicenses.map((license, index) => ({
          id: license.id,
          order: index,
          user_id: license.user_id,
          updated_at: new Date().toISOString(),
          name: license.name,
          type: license.type,
          price: license.price,
          file_types: license.file_types,
          is_enabled: license.is_enabled,
          is_featured: license.is_featured,
          distribution_limit: license.distribution_limit,
          streaming_limit: license.streaming_limit,
          music_video_limit: license.music_video_limit,
          radio_station_limit: license.radio_station_limit,
          allow_profit_performances: license.allow_profit_performances,
          require_tagging: license.require_tagging,
          require_credit: license.require_credit,
          custom_terms: license.custom_terms,
          default_for_new_tracks: license.default_for_new_tracks,
        }));

        const { error } = await supabase.from("licenses").upsert(updates, {
          onConflict: "id",
        });

        if (error) throw error;

        toast.success("Order updated successfully");
      } catch (error) {
        console.error("Error updating license order:", error);
        toast.error("Failed to update order");
        invalidateData("licenses");
        await fetchData("licenses", true);
      }
    }
  };

  const handleDeleteClick = (license: License) => {
    setLicenseToDelete(license);
    setDeleteDialogOpen(true);
  };

  const handleApplyToAll = async (license: License) => {
    try {
      const priceColumn = getLicensePriceColumn(license.name);
      const { error } = await supabase
        .from("tracks")
        .update({
          [priceColumn]: license.price,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", license.user_id);

      if (error) throw error;

      invalidateData("licenses");
      invalidateData("tracks");
      await Promise.all([
        fetchData("licenses", true),
        fetchData("tracks", true),
      ]);

      toast.success(`Applied ${license.name} price to all tracks`);
    } catch (error) {
      console.error("Error applying price to all tracks:", error);
      toast.error("Failed to update track prices");
    }
  };

  if (error) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="text-red-500 mb-4">
          {error.message || "An error occurred"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-200 text-black rounded-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-[12px] uppercase tracking-wider font-medium text-neutral-500 mb-2">
        <div className="grid grid-cols-[24px,48px,2fr,2.2fr,120px] gap-2 px-4">
          <div></div>
          <div className="flex items-center justify-center">
            <div className="w-4 h-4" />
          </div>
          <div className="flex items-center">NAME</div>
          <div className="hidden md:flex items-center ">PRICE</div>
          <div></div>
        </div>
      </div>

      <div className="border border-white/10 rounded-lg overflow-visible">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={licenses}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {licenses.map((license) => (
                <SortableLicenseRow
                  key={license.id}
                  id={license.id}
                  license={license}
                  isSelected={selectedLicenses.includes(license.id)}
                  onSelect={() => {
                    setSelectedLicenses((prev) =>
                      prev.includes(license.id)
                        ? prev.filter((id) => id !== license.id)
                        : [...prev, license.id]
                    );
                  }}
                  onEdit={() => onEditLicense(license)}
                  onDelete={() => handleDeleteClick(license)}
                  onApplyToAll={() => handleApplyToAll(license)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {selectedLicenses.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
          <Check className="w-4 h-4" />
          <span>{selectedLicenses.length} selected</span>

          {/* Added Select All button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelectedLicenses(licenses.map((license) => license.id))
            }
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
          setLicenseToDelete(null);
        }}
        onConfirm={async () => {
          if (licenseToDelete) {
            try {
              const { error } = await supabase
                .from("licenses")
                .delete()
                .eq("id", licenseToDelete.id);

              if (error) throw error;

              toast.success("License deleted successfully");
              invalidateData("licenses");
              await fetchData("licenses", true);
            } catch (error) {
              console.error("Error deleting license:", error);
              toast.error("Failed to delete license");
            }
            setDeleteDialogOpen(false);
            setLicenseToDelete(null);
          }
        }}
        title="Delete License"
        description="Are you sure you want to delete this license? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={async () => {
          try {
            const { error } = await supabase
              .from("licenses")
              .delete()
              .in("id", selectedLicenses);

            if (error) throw error;

            toast.success("Selected licenses deleted successfully");
            setSelectedLicenses([]);
            invalidateData("licenses");
            await fetchData("licenses", true);
          } catch (error) {
            console.error("Error deleting licenses:", error);
            toast.error("Failed to delete selected licenses");
          }
          setBulkDeleteDialogOpen(false);
        }}
        title="Delete Selected Licenses"
        description={`Are you sure you want to delete ${selectedLicenses.length} licenses? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
