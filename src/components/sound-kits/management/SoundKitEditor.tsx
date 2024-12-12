"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { BasicInfo } from "./sections/BasicInfo";
import { MediaFiles } from "./sections/MediaFiles";
import { Description } from "./sections/Description";
import { Collaborators } from "./sections/Collaborators";
import { uploadFile, STORAGE_BUCKETS } from "@/lib/utils/storageUtils";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { useDataStore } from "@/lib/store/dataStore";
import { useAuthStore } from "@/lib/store/authStore";
import type { SoundKit, SoundKitFormData } from "@/lib/types/soundKitTypes";

interface SoundKitEditorProps {
  editingKit: SoundKit | null | undefined;
  onBack: () => void;
}

const defaultFormData: SoundKitFormData = {
  title: "",
  artist: "",
  price: 0,
  description: "",
  cover_art: null,
  sound_kit_file: null,
  preview_file: null,

  tags: [],
  features: [],
  collaborators: [{ name: "", role: "", shares: "" }],
};

const cacheBuster = `?t=${Date.now()}`;

export function SoundKitEditor({ editingKit, onBack }: SoundKitEditorProps) {
  const [saving, setSaving] = useState(false);
  const { user } = useAuthStore();
  const fetchData = useDataStore((state) => state.fetchData);
  const invalidateData = useDataStore((state) => state.invalidateData);

  const [formData, setFormData] = useState<SoundKitFormData>(
    editingKit
      ? {
          title: editingKit.title,
          artist: editingKit.artist || "",
          price: editingKit.price,
          description: editingKit.description || "",
          cover_art: null,
          sound_kit_file: null,
          preview_file: null,
          tags: editingKit.tags || [],
          features: editingKit.features || [],
          collaborators: Array.isArray(editingKit.collaborators)
            ? editingKit.collaborators.map((collab) =>
                typeof collab === "string"
                  ? { name: collab, role: "", shares: "" }
                  : collab
              )
            : [{ name: "", role: "", shares: "" }],
        }
      : defaultFormData
  );

  const saveKit = useCallback(async () => {
    try {
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }

      if (!formData.title || formData.price <= 0) {
        toast.error("Please fill in all required fields");
        return;
      }

      setSaving(true);

      const kitId = editingKit?.id || crypto.randomUUID();
      let coverArtPath = editingKit?.cover_art;
      let soundKitPath = editingKit?.sound_kit_file;
      let previewPath = editingKit?.preview_file;

      // Handle cover art deletion and upload
      if (editingKit?.cover_art && !formData.cover_art) {
        await supabase.storage
          .from(STORAGE_BUCKETS.SOUND_KITS_COVERS)
          .remove([
            editingKit.cover_art.split(
              `${STORAGE_BUCKETS.SOUND_KITS_COVERS}/`
            )[1],
          ]);
      }

      if (formData.cover_art) {
        const fileName = `${formData.artist} - ${formData.title}.jpg`;
        await uploadFile(
          formData.cover_art,
          STORAGE_BUCKETS.SOUND_KITS_COVERS,
          user.id,
          kitId,
          fileName,
          undefined,
          editingKit?.cover_art || undefined
        ).then((path) => {
          coverArtPath = `${path}${cacheBuster}`;
        });
      }

      // Handle sound kit file upload
      if (formData.sound_kit_file) {
        const fileName = `${formData.artist} - ${formData.title}.zip`;
        await uploadFile(
          formData.sound_kit_file,
          STORAGE_BUCKETS.SOUND_KITS,
          user.id,
          kitId,
          fileName,
          undefined,
          editingKit?.sound_kit_file || undefined
        ).then((path) => {
          soundKitPath = path;
        });
      }

      // Handle preview file upload
      if (formData.preview_file) {
        const fileName = `${formData.artist} - ${formData.title}.mp3`;
        await uploadFile(
          formData.preview_file,
          STORAGE_BUCKETS.SOUND_KIT_PREVIEWS,
          user.id,
          kitId,
          fileName,
          undefined,
          editingKit?.preview_file || undefined
        ).then((path) => {
          previewPath = path;
        });
      }

      const kitData = {
        id: kitId,
        user_id: user.id,
        title: formData.title,
        artist: formData.artist,
        price: formData.price,
        description: formData.description,
        cover_art: coverArtPath || undefined,
        sound_kit_file: soundKitPath || undefined,
        preview_file: previewPath || undefined,
        samples: [],
        tags: formData.tags,
        features: formData.features,
        collaborators: formData.collaborators,
        updated_at: new Date().toISOString(),
      };

      if (editingKit) {
        const { error } = await supabase
          .from("sound_kits")
          .update(kitData)
          .eq("id", editingKit.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Sound kit updated successfully!", {
          style: {
            background: "rgba(22, 101, 52, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#fff",
          },
        });
      } else {
        const { error } = await supabase.from("sound_kits").insert([
          {
            ...kitData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success("Sound kit created successfully!", {
          style: {
            background: "rgba(22, 101, 52, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#fff",
          },
        });
      }

      // Invalidate and force refresh sound kits data
      invalidateData("soundKits");
      await fetchData("soundKits", true);

      // Short delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onBack();
    } catch (error) {
      console.error("Error saving sound kit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save sound kit",
        {
          style: {
            background: "rgba(153, 27, 27, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#fff",
          },
        }
      );
    } finally {
      setSaving(false);
    }
  }, [formData, editingKit, user, invalidateData, fetchData, onBack]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Sound Kits
          </Button>

          <BasicInfo formData={formData} setFormData={setFormData} />
          <MediaFiles
            formData={formData}
            setFormData={setFormData}
            existingFiles={{
              cover_art: editingKit?.cover_art ?? null,
              sound_kit_file: editingKit?.sound_kit_file ?? null,
              preview_file: editingKit?.preview_file ?? null,
            }}
          />
          <Description formData={formData} setFormData={setFormData} />
          <Collaborators formData={formData} setFormData={setFormData} />

          <Button
            onClick={saveKit}
            disabled={saving}
            className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg rounded-full font-bold"
          >
            {saving
              ? "Saving..."
              : editingKit
              ? "Update Sound Kit"
              : "Create Sound Kit"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
