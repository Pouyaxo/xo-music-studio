"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Star, Pencil, Trash2, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { PriceInput } from "./PriceInput";
import { cn } from "@/lib/utils";
import type { License } from "@/lib/types/licenseTypes";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import { useDataStore } from "@/lib/store/dataStore";

interface SortableLicenseRowProps {
  id: string;
  license: License;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onApplyToAll: () => void;
}

export function SortableLicenseRow({
  id,
  license,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onApplyToAll,
}: SortableLicenseRowProps) {
  const [price, setPrice] = React.useState(license.price?.toString() || "");
  const [isFeatured, setIsFeatured] = React.useState(license.is_featured);
  const invalidateData = useDataStore((state) => state.invalidateData);
  const fetchData = useDataStore((state) => state.fetchData);
  const licenses = useDataStore((state) => state.licenses);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 150,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 999 : undefined,
    position: "relative" as const,
    touchAction: "none",
    willChange: "transform",
  };

  // Update local isFeatured state when license changes
  React.useEffect(() => {
    setIsFeatured(license.is_featured);
  }, [license.is_featured]);

  const determineLicenseType = (license: License): string => {
    if (license.type === "exclusive") return "exclusive";

    const fileTypes = license.file_types || [];
    const hasMP3 = fileTypes.includes("MP3");
    const hasWAV = fileTypes.includes("WAV");
    const hasStems = fileTypes.includes("Stems");
    const hasUnlimitedDistribution = license.distribution_limit === null;
    const hasUnlimitedStreaming = license.streaming_limit === null;

    if (hasUnlimitedDistribution && hasUnlimitedStreaming) return "unlimited";
    if (hasStems) return "stems";
    if (hasWAV) return "wav";
    if (hasMP3 && fileTypes.length === 1) return "mp3";
    return "mp3";
  };

  const getLicensePriceColumn = (licenseType: string): string => {
    switch (licenseType) {
      case "mp3":
        return "mp3_license_price";
      case "wav":
        return "wav_license_price";
      case "stems":
        return "stems_license_price";
      case "unlimited":
        return "unlimited_license_price";
      case "exclusive":
        return "exclusive_license_price";
      default:
        throw new Error(`Unknown license type: ${licenseType}`);
    }
  };

  const handlePriceUpdate = async () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice)) return;

    try {
      const licenseType = determineLicenseType(license);
      const priceColumn = getLicensePriceColumn(licenseType);

      await Promise.all([
        supabase
          .from("licenses")
          .update({
            price: newPrice,
            updated_at: new Date().toISOString(),
          })
          .eq("id", license.id),

        supabase
          .from("tracks")
          .update({
            [priceColumn]: newPrice,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", license.user_id)
          .not("not_for_sale", "eq", true)
          .not("private", "eq", true),
      ]);

      toast.success("Price updated successfully");

      invalidateData("licenses");
      invalidateData("tracks");
      await Promise.all([
        fetchData("licenses", true),
        fetchData("tracks", true),
      ]);
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
      setPrice(license.price?.toString() || "");
    }
  };

  const handleStarClick = async () => {
    try {
      // Update all licenses to be unfeatured first
      await supabase
        .from("licenses")
        .update({
          is_featured: false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", license.user_id);

      // If we're not currently featured, set this license as featured
      if (!isFeatured) {
        const { error } = await supabase
          .from("licenses")
          .update({
            is_featured: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", license.id);

        if (error) throw error;
      }

      // Update all licenses in the UI
      licenses.forEach((license) => {
        if (license.is_featured) {
          license.is_featured = false;
        }
      });

      // Update local state
      setIsFeatured(!isFeatured);

      toast.success(isFeatured ? "Removed from featured" : "Set as featured");
      invalidateData("licenses");
      await fetchData("licenses", true);
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
      setIsFeatured(isFeatured);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-[70px] grid grid-cols-[24px,48px,2fr,120px] md:grid-cols-[24px,48px,2fr,3fr,120px] gap-2 px-4 items-center",
        "hover:bg-white/[0.02] transition-colors duration-200",
        "border-b border-white/5 last:border-b-0",
        isDragging &&
          "shadow-xl bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-white/5"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
      </div>

      <div className="flex items-center justify-center">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>

      <div className="flex items-center justify-between text-[14px] text-white whitespace-nowrap">
        {license.name}
      </div>

      <div className="hidden md:flex min-w-[140px]">
        <PriceInput
          value={price}
          onChange={setPrice}
          onBlur={handlePriceUpdate}
          className="!h-8 text-center" // Force height and ensure text centering
        />
      </div>

      <div className="flex items-center justify-end gap-1">
        <button
          onClick={handleStarClick}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <Star
            className={cn(
              "w-4 h-4",
              isFeatured ? "fill-white text-white" : "text-white-600"
            )}
          />
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
