"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { BasicInfo } from "@/components/licenses/management/sections/BasicInfo";
import { MediaFiles } from "@/components/licenses/management/sections/MediaFiles";
import { Description } from "@/components/licenses/management/sections/Description";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { useDataStore } from "@/lib/store/dataStore";
import { useAuthStore } from "@/lib/store/authStore";
import type { License, LicenseFormData } from "@/lib/types/licenseTypes";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

interface Props {
  editingLicense?: License;
  onBack: () => void;
}

const defaultLicense: LicenseFormData = {
  name: "",
  type: "non-exclusive",
  price: 0,
  features: [],
  file_types: [],
  is_enabled: true,
  is_featured: false,
  distribution_limit: undefined,
  streaming_limit: undefined,
  music_video_limit: undefined,
  radio_station_limit: undefined,
  allow_profit_performances: false,
  require_tagging: false,
  require_credit: false,
  default_for_new_tracks: false,
};

export function LicenseEditor({ editingLicense, onBack }: Props) {
  const [saving, setSaving] = useState(false);
  const { user } = useAuthStore();
  const fetchData = useDataStore((state) => state.fetchData);
  const invalidateData = useDataStore((state) => state.invalidateData);

  const [formData, setFormData] = useState<LicenseFormData>(() => {
    if (editingLicense) {
      return {
        ...editingLicense,
      };
    }
    return defaultLicense;
  });

  const saveLicense = useCallback(async () => {
    try {
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }

      setSaving(true);

      const licenseData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      console.log("Attempting to save license:", licenseData);

      if (editingLicense) {
        const { data, error } = await supabase
          .from("licenses")
          .update(licenseData)
          .eq("id", editingLicense.id)
          .eq("user_id", user.id)
          .select("*")
          .single();

        if (error) {
          console.error("License update error:", error);
          throw error;
        }

        console.log("Updated license response:", data);
      } else {
        const { error } = await supabase.from("licenses").insert([
          {
            ...licenseData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      await supabase
        .from("licenses")
        .select("*")
        .order("order", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) {
            useDataStore.getState().setData("licenses", data);
          }
        });

      invalidateData("licenses");
      await fetchData("licenses", true);

      toast.success("License updated successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1500));
      onBack();
    } catch (error) {
      console.error("Error saving license:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save license"
      );
    } finally {
      setSaving(false);
    }
  }, [formData, editingLicense, user, invalidateData, fetchData, onBack]);

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
            Back to Licenses
          </Button>

          <BasicInfo formData={formData} setFormData={setFormData} />
          <MediaFiles formData={formData} setFormData={setFormData} />
          <Description formData={formData} setFormData={setFormData} />

          <Button
            onClick={saveLicense}
            disabled={saving}
            className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg rounded-full font-bold"
          >
            {saving
              ? "Saving..."
              : editingLicense
              ? "Update License"
              : "Create License"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
