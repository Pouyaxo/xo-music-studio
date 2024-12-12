"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { BasicInfo } from "./sections/BasicInfo";
import { AudioFiles } from "./sections/AudioFiles";
import { Pricing } from "./sections/Pricing";
import { TrackDetails } from "./sections/TrackDetails";
import { Collaborators } from "./sections/Collaborators";
import { RelatedVideos } from "./sections/RelatedVideos";
import { uploadFile, STORAGE_BUCKETS } from "@/lib/utils/storageUtils";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { useDataStore } from "@/lib/store/dataStore";
import { useAuthStore } from "@/lib/store/authStore";
import type { TrackFormData } from "@/lib/types/mainTypes";

interface Props {
  editingTrack?: any;
  onBack: () => void;
}

export function TrackMetadataEditor({ editingTrack, onBack }: Props) {
  const [saving, setSaving] = useState(false);
  const { user } = useAuthStore();
  const fetchData = useDataStore((state) => state.fetchData);
  const invalidateData = useDataStore((state) => state.invalidateData);

  const [formData, setFormData] = useState<TrackFormData>({
    title: editingTrack?.title || "",
    artist: editingTrack?.artist || "",
    tags: Array.isArray(editingTrack?.tags) ? editingTrack.tags : [],
    track_type: editingTrack?.track_type || "",
    release_date: editingTrack?.release_date || null,
    cover_art: null,
    file_path: editingTrack?.file_path || null,
    audio_files: {
      untagged_mp3: null,
      untagged_wav: null,
      tagged_wav: null,
      stems_file: null,
    },
    preferences: {
      not_for_sale: editingTrack?.not_for_sale || false,
      private: editingTrack?.private || false,
      exclude_bulk_discount: editingTrack?.exclude_bulk_discount || false,
    },
    pricing: {
      mp3_license_price: editingTrack?.mp3_license_price || 0,
      wav_license_price: editingTrack?.wav_license_price || 0,
      stems_license_price: editingTrack?.stems_license_price || 0,
      unlimited_license_price: editingTrack?.unlimited_license_price || 0,
    },
    free_download: {
      enabled: editingTrack?.allow_download || false,
      download_type: editingTrack?.free_download_type || "Tagged MP3",
      required_action: editingTrack?.required_action || "Email",
      social_platforms: editingTrack?.social_platforms || [],
    },
    details: {
      primary_genre: editingTrack?.primary_genre || "",
      subgenre: editingTrack?.subgenre || "",
      primary_mood: editingTrack?.primary_mood || "",
      secondary_mood: editingTrack?.secondary_mood || "",
      description: editingTrack?.description || "",
      bpm: editingTrack?.bpm?.toString() || "",
      key: editingTrack?.key || "",
    },
    collaborators: editingTrack?.collaborators || [
      { name: "", role: "", shares: "" },
    ],
    related_videos: editingTrack?.related_videos || [""],
  });

  console.log("MetadataEditor render:", {
    editingTrack,
    hasId: editingTrack?.id,
    editingTrackId: editingTrack?.id,
  });

  const saveTrack = useCallback(async () => {
    try {
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }

      if (!formData.title || !formData.artist || !formData.track_type) {
        toast.error("Please fill in all required fields");
        return;
      }

      setSaving(true);
      const trackId = editingTrack ? editingTrack.id : crypto.randomUUID();
      console.log("Track ID decision:", {
        editingTrack,
        editingTrackId: editingTrack?.id,
        finalTrackId: trackId,
      });

      // Add debug logs
      console.log("Track operation:", editingTrack ? "EDIT" : "CREATE");
      console.log("Track ID:", trackId);
      console.log("Editing Track:", editingTrack);

      let coverArtPath = editingTrack?.cover_art;
      let untaggedMp3Path = editingTrack?.untagged_mp3;
      let untaggedWavPath = editingTrack?.untagged_wav;
      let taggedWavPath = editingTrack?.tagged_wav;
      let stemsPath = editingTrack?.stems_file;

      // Log existing paths
      console.log("Initial paths:", {
        coverArtPath,
        untaggedMp3Path,
        untaggedWavPath,
        taggedWavPath,
        stemsPath,
      });

      const uploadPromises = [];

      // Add cache busting for cover art
      const cacheBuster = `?t=${Date.now()}`;

      // If we're editing and the name/artist changed, rename existing files
      if (
        editingTrack &&
        (editingTrack.title !== formData.title ||
          editingTrack.artist !== formData.artist)
      ) {
        const renamePromises = [];

        // Rename cover art if it exists
        if (editingTrack.cover_art) {
          renamePromises.push(
            uploadFile(
              formData.cover_art || null,
              STORAGE_BUCKETS.COVERS,
              user.id,
              trackId,
              `${formData.artist} - ${formData.title}.jpg`,
              undefined,
              editingTrack.cover_art
            ).then((path) => {
              coverArtPath = path;
            })
          );
        }

        // Rename untagged MP3 if it exists
        if (editingTrack.untagged_mp3) {
          renamePromises.push(
            uploadFile(
              formData.audio_files.untagged_mp3 || null,
              STORAGE_BUCKETS.TRACKS,
              user.id,
              trackId,
              `${formData.artist} - ${formData.title}.mp3`,
              "untagged",
              editingTrack.untagged_mp3
            ).then((path) => {
              untaggedMp3Path = path;
            })
          );
        }

        // Rename untagged WAV if it exists
        if (editingTrack.untagged_wav) {
          renamePromises.push(
            uploadFile(
              formData.audio_files.untagged_wav || null,
              STORAGE_BUCKETS.TRACKS,
              user.id,
              trackId,
              `${formData.artist} - ${formData.title}.wav`,
              "untagged",
              editingTrack.untagged_wav
            ).then((path) => {
              untaggedWavPath = path;
            })
          );
        }

        // Rename tagged WAV if it exists
        if (editingTrack.tagged_wav) {
          renamePromises.push(
            uploadFile(
              formData.audio_files.tagged_wav || null,
              STORAGE_BUCKETS.TRACKS,
              user.id,
              trackId,
              `${formData.artist} - ${formData.title}.mp3`,
              "tagged",
              editingTrack.tagged_wav
            ).then((path) => {
              taggedWavPath = path;
            })
          );
        }

        // Rename stems if they exist
        if (editingTrack.stems_file) {
          renamePromises.push(
            uploadFile(
              formData.audio_files.stems_file || null,
              STORAGE_BUCKETS.STEMS,
              user.id,
              trackId,
              `${formData.artist} - ${formData.title}.zip`,
              undefined,
              editingTrack.stems_file
            ).then((path) => {
              stemsPath = path;
            })
          );
        }

        uploadPromises.push(...renamePromises);
      }

      // Handle file uploads
      if (formData.cover_art) {
        const fileName = `${formData.artist} - ${formData.title}.jpg`;
        uploadPromises.push(
          uploadFile(
            formData.cover_art,
            STORAGE_BUCKETS.COVERS,
            user.id,
            trackId,
            fileName,
            undefined,
            editingTrack?.cover_art
          ).then((path) => {
            coverArtPath = `${path}${cacheBuster}`;
          })
        );
      }

      // Handle untagged files
      if (formData.audio_files.untagged_mp3) {
        const fileName = `${formData.artist} - ${formData.title}.mp3`;
        uploadPromises.push(
          uploadFile(
            formData.audio_files.untagged_mp3,
            STORAGE_BUCKETS.TRACKS,
            user.id,
            trackId,
            fileName,
            "untagged",
            editingTrack?.untagged_mp3
          ).then((path) => {
            untaggedMp3Path = path;
          })
        );
      }

      if (formData.audio_files.untagged_wav) {
        const fileName = `${formData.artist} - ${formData.title}.wav`;
        uploadPromises.push(
          uploadFile(
            formData.audio_files.untagged_wav,
            STORAGE_BUCKETS.TRACKS,
            user.id,
            trackId,
            fileName,
            "untagged",
            editingTrack?.untagged_wav
          ).then((path) => {
            untaggedWavPath = path;
          })
        );
      }

      // Handle tagged files
      if (formData.audio_files.tagged_wav) {
        const fileName = `${formData.artist} - ${formData.title}.mp3`;
        uploadPromises.push(
          uploadFile(
            formData.audio_files.tagged_wav,
            STORAGE_BUCKETS.TRACKS,
            user.id,
            trackId,
            fileName,
            "tagged",
            editingTrack?.tagged_wav
          ).then((path) => {
            taggedWavPath = path;
          })
        );
      }

      // Handle stems
      if (formData.audio_files.stems_file) {
        const fileName = `${formData.artist} - ${formData.title} - Stems.zip`;
        uploadPromises.push(
          uploadFile(
            formData.audio_files.stems_file,
            STORAGE_BUCKETS.STEMS,
            user.id,
            trackId,
            fileName,
            undefined,
            editingTrack?.stems_file
          ).then((path) => {
            stemsPath = path;
          })
        );
      }

      await Promise.all(uploadPromises);

      // Prepare track data for database
      const trackData = {
        id: trackId,
        track_id: trackId,
        user_id: user.id,
        title: formData.title,
        artist: formData.artist,
        tags: formData.tags,
        track_type: formData.track_type,
        release_date: formData.release_date || undefined,
        cover_art: coverArtPath,
        untagged_mp3: untaggedMp3Path || undefined,
        untagged_wav: untaggedWavPath || undefined,
        tagged_wav: taggedWavPath || undefined,
        stems_file: stemsPath || undefined,

        // Preferences
        private: formData.preferences.private,
        not_for_sale: formData.preferences.not_for_sale,
        exclude_bulk_discount: formData.preferences.exclude_bulk_discount,

        // Pricing
        mp3_license_price: formData.pricing.mp3_license_price,
        wav_license_price: formData.pricing.wav_license_price,
        stems_license_price: formData.pricing.stems_license_price,
        unlimited_license_price: formData.pricing.unlimited_license_price,

        // Free download options
        allow_download: formData.free_download.enabled,
        free_download_type: formData.free_download.download_type,
        required_action: formData.free_download.required_action,
        social_platforms: formData.free_download.social_platforms,

        // Track details
        primary_genre: formData.details.primary_genre,
        subgenre: formData.details.subgenre,
        primary_mood: formData.details.primary_mood,
        secondary_mood: formData.details.secondary_mood,
        description: formData.details.description,
        bpm: parseInt(formData.details.bpm) || undefined,
        key: formData.details.key,

        // Collaborators and videos
        collaborators: formData.collaborators,
        related_videos: formData.related_videos,

        updated_at: new Date().toISOString(),
        created_at: editingTrack ? undefined : new Date().toISOString(),
      };

      if (editingTrack) {
        const { error } = await supabase
          .from("tracks")
          .update(trackData)
          .eq("id", editingTrack.id);

        if (error) throw error;

        // Force refresh of tracks data to update UI immediately
        invalidateData("tracks");
        await fetchData("tracks", true);

        toast.success("Track updated successfully!");
      } else {
        // For new tracks, include created_at
        const { id, updated_at, ...newTrackData } = trackData;
        const { error } = await supabase.from("tracks").insert([
          {
            ...newTrackData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success("Track created successfully!", {
          style: {
            background: "rgba(22, 101, 52, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#fff",
          },
        });
      }

      // Short delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onBack();
    } catch (error) {
      console.error("Error saving track:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save track"
      );
    } finally {
      setSaving(false);
    }
  }, [formData, editingTrack, user, invalidateData, fetchData, onBack]);

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
            Back to Track List
          </Button>

          <BasicInfo formData={formData} setFormData={setFormData} />
          <AudioFiles
            formData={formData}
            setFormData={setFormData}
            existingFiles={{
              cover_art: editingTrack?.cover_art,
              untagged_mp3: editingTrack?.untagged_mp3,
              untagged_wav: editingTrack?.untagged_wav,
              tagged_wav: editingTrack?.tagged_wav,
              stems_file: editingTrack?.stems_file,
            }}
          />
          <Pricing formData={formData} setFormData={setFormData} />
          <TrackDetails formData={formData} setFormData={setFormData} />
          <Collaborators formData={formData} setFormData={setFormData} />
          <RelatedVideos formData={formData} setFormData={setFormData} />

          <Button
            onClick={saveTrack}
            disabled={saving}
            className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg rounded-full font-bold"
          >
            {saving
              ? "Saving..."
              : editingTrack
              ? "Update Track"
              : "Create Track"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
