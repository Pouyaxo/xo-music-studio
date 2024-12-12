"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import { ProfilePhotoUpload } from "./profile/PhotoUpload";
import { FormInput } from "./profile/FormInput";
import { Button } from "@/components/ui/Button";
import {
  uploadFile,
  getStorageUrl,
  STORAGE_BUCKETS,
} from "@/lib/utils/storageUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useDataStore } from "@/lib/store/dataStore";
import { User } from "lucide-react";
import { compressImage } from "@/lib/utils/imageUtils";

export function ProfileSection() {
  const { user, updateUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.user_metadata?.first_name || "",
    last_name: user?.user_metadata?.last_name || "",
    display_name: user?.user_metadata?.display_name || "",
    location: user?.user_metadata?.location || "",
  });
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    user?.user_metadata?.profile_photo_url || "/default-avatar.jpg"
  );

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  // Update the fetchUserData function
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uuid", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    if (data) {
      setFormData({
        first_name: data.first_name || user?.user_metadata?.first_name || "",
        last_name: data.last_name || user?.user_metadata?.last_name || "",
        display_name:
          data.display_name || user?.user_metadata?.display_name || "",
        location: data.location || user?.user_metadata?.location || "",
      });

      // Set photo preview
      if (data.profile_photo_url) {
        setPhotoPreview(
          data.profile_photo_url.startsWith("http")
            ? data.profile_photo_url
            : getStorageUrl(data.profile_photo_url)
        );
      }
    }
  }, [user]);

  // Update useEffect to handle initial state
  useEffect(() => {
    if (user) {
      // Initialize with user metadata first
      setFormData({
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        display_name: user.user_metadata?.display_name || "",
        location: user.user_metadata?.location || "",
      });

      if (user.user_metadata?.profile_photo_url) {
        setPhotoPreview(
          user.user_metadata.profile_photo_url.startsWith("http")
            ? user.user_metadata.profile_photo_url
            : getStorageUrl(user.user_metadata.profile_photo_url)
        );
      }

      // Then fetch complete data
      fetchUserData();
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    try {
      // Only show loading toast if file needs compression
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      const loadingToastId =
        file.size > maxSize ? toast.loading("Processing image...") : null;

      // Compress image if needed
      const processedFile = await compressImage(file, 2);

      // Update preview and store file for later upload
      setNewPhotoFile(processedFile);
      setPhotoPreview(URL.createObjectURL(processedFile));

      // Only show success message if compression was needed
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        toast.success("Image processed successfully");
      }
    } catch (error) {
      toast.dismiss(); // Dismiss any existing toasts
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  // Modify updateProfile to handle the photo URL correctly
  const updateProfile = async () => {
    try {
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }

      setLoading(true);

      // Upload photo if there's a new one
      let profile_photo_url = user.user_metadata?.profile_photo_url;
      let fullPhotoUrl = profile_photo_url;

      if (newPhotoFile) {
        // Generate a unique filename with timestamp
        const timestamp = Date.now();
        const filename = `avatar-${timestamp}`;

        // Clean up old avatars
        const { data: oldFiles } = await supabase.storage
          .from("avatars")
          .list(user.id);

        if (oldFiles?.length) {
          await supabase.storage
            .from("avatars")
            .remove(oldFiles.map((f) => `${user.id}/${f.name}`));
        }

        // Upload new avatar with unique filename
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/${filename}`, newPhotoFile, {
            upsert: true,
            cacheControl: "no-cache",
          });

        if (uploadError) throw uploadError;

        profile_photo_url = `avatars/${user.id}/${filename}`;

        // Get the public URL and force no caching
        const { data: publicUrl } = await supabase.storage
          .from("avatars")
          .createSignedUrl(`${user.id}/${filename}`, 31536000); // 1 year expiry

        fullPhotoUrl = publicUrl?.signedUrl || getStorageUrl(profile_photo_url);

        // Update the preview immediately with the signed URL
        setPhotoPreview(fullPhotoUrl);
      }

      // First update the users table
      const { error: dbError } = await supabase
        .from("users")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          display_name: formData.display_name,
          location: formData.location,
          profile_photo_url: fullPhotoUrl, // Store the full URL
          updated_at: new Date().toISOString(),
        })
        .eq("uuid", user.id);

      if (dbError) throw dbError;

      // Then update auth metadata
      const {
        data: { user: updatedUser },
        error: updateError,
      } = await supabase.auth.updateUser({
        data: {
          ...formData,
          profile_photo_url: fullPhotoUrl, // Store the full URL
          updated_at: new Date().toISOString(),
        },
      });

      if (updateError) throw updateError;

      // Create a complete user object with the new data
      const completeUserData = {
        ...updatedUser,
        ...formData,
        profile_photo_url: fullPhotoUrl,
        user_metadata: {
          ...updatedUser?.user_metadata,
          profile_photo_url: fullPhotoUrl,
          ...formData,
        },
      };

      // Update local state with all the user data
      updateUserData(completeUserData);

      // Force a refresh of the auth session
      await useAuthStore.getState().refreshSession();

      setNewPhotoFile(null);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error:", err.message);
        toast.error(err.message || "Failed to update profile");
      } else if (typeof err === "object" && err !== null) {
        const errorObj = err as { message?: string; error?: string };
        const errorMessage =
          errorObj.message || errorObj.error || "Failed to update profile";

        // Handle specific error cases
        if (errorMessage.includes("Payload too large")) {
          toast.error(
            "Image size is too large. Please choose a smaller image (max 2MB)"
          );
        } else {
          toast.error(errorMessage);
        }
        console.error("Error:", errorObj);
      } else {
        console.error("Unknown error:", err);
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <ProfilePhotoUpload
            photoUrl={photoPreview}
            displayName={formData.display_name || formData.first_name || ""}
            firstName={formData.first_name || ""}
            onPhotoChange={handlePhotoChange}
            defaultView={
              <div className="w-24 h-24 relative rounded-full overflow-hidden bg-black/40 backdrop-blur-[6px] flex items-center justify-center border border-white/20">
                <User className="w-8 h-8 text-neutral-200" />
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, first_name: e.target.value }))
            }
            placeholder="Enter your first name"
          />
          <FormInput
            label="Last name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, last_name: e.target.value }))
            }
            placeholder="Enter your last name"
          />
        </div>

        <FormInput
          label="Display name"
          value={formData.display_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, display_name: e.target.value }))
          }
          placeholder="Enter your display name"
        />

        <FormInput
          label="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="Enter your location"
        />

        <Button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg rounded-full font-bold"
        >
          {loading ? "Saving changes..." : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
