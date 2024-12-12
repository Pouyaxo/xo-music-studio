"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { isWavFile, isMp3File } from "@/lib/utils/audioUtils";
import { convertToMp3 } from "@/lib/utils/audioConversion";
import Image from "next/image";

interface MediaFilesProps {
  formData: any;
  setFormData: (data: any) => void;
  existingFiles: {
    cover_art: string | null;
    sound_kit_file: string | null;
    preview_file: string | null;
  };
}

export function MediaFiles({
  formData,
  setFormData,
  existingFiles,
}: MediaFilesProps) {
  const [convertingPreview, setConvertingPreview] = useState(false);

  const coverUrl = existingFiles.cover_art
    ? getStorageUrl(existingFiles.cover_art)
    : "/images/default-cover.jpg";

  const handlePreviewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (isWavFile(file)) {
        setConvertingPreview(true);
        // Convert WAV to MP3
        const mp3File = await convertToMp3(file);
        setFormData({
          ...formData,
          preview_file: mp3File,
        });
      } else if (isMp3File(file)) {
        setFormData({
          ...formData,
          preview_file: file,
        });
      }
    } catch (error) {
      console.error("Error handling preview file:", error);
    } finally {
      setConvertingPreview(false);
    }
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Media Files</CardTitle>
        <CardDescription>Upload your sound kit files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Sound Kit Files Section */}
          <div className="space-y-4">
            {/* Main Sound Kit ZIP */}
            <div
              className="bg-zinc-900/50 p-4 rounded-lg cursor-pointer hover:bg-zinc-900/70 transition-colors border border-white/10"
              onClick={() =>
                document.getElementById("sound-kit-input")?.click()
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Kit ZIP</h3>
                  <p className="text-sm text-gray-400">
                    ZIP file containing all samples
                  </p>
                  {formData.sound_kit_file && (
                    <p className="text-sm text-blue-400 mt-2">
                      New file: {formData.sound_kit_file.name}
                    </p>
                  )}
                  {!formData.sound_kit_file && existingFiles.sound_kit_file && (
                    <p className="text-sm text-blue-400">
                      Current file:{" "}
                      {existingFiles.sound_kit_file.split("/").pop()}
                    </p>
                  )}
                </div>
                <Upload className="text-blue-500" size={24} />
              </div>
              <Input
                id="sound-kit-input"
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sound_kit_file: e.target.files?.[0] || null,
                  })
                }
              />
            </div>

            {/* Preview File */}
            <div
              className="bg-zinc-900/50 p-4 rounded-lg cursor-pointer hover:bg-zinc-900/70 transition-colors border border-white/10"
              onClick={() => document.getElementById("preview-input")?.click()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Preview File</h3>
                  <p className="text-sm text-gray-400">MP3 or WAV preview</p>
                  {formData.preview_file && (
                    <p className="text-sm text-blue-400 mt-2">
                      New file: {formData.preview_file.name}
                    </p>
                  )}
                  {!formData.preview_file && existingFiles.preview_file && (
                    <p className="text-sm text-blue-400">
                      Current file:{" "}
                      {existingFiles.preview_file.split("/").pop()}
                    </p>
                  )}
                </div>
                <Upload className="text-blue-500" size={24} />
              </div>
              <Input
                id="preview-input"
                type="file"
                accept=".mp3,.wav"
                className="hidden"
                onChange={handlePreviewFileChange}
                disabled={convertingPreview}
              />
            </div>
          </div>

          {/* Cover Art Section */}
          <div
            className="bg-zinc-900/50 p-6 rounded-lg border border-white/10"
            onClick={() => document.getElementById("cover-art-input")?.click()}
          >
            <h3 className="font-medium mb-2">Cover Art</h3>
            <div className="aspect-square bg-black rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/70 transition-colors">
              {formData.cover_art ? (
                <Image
                  src={URL.createObjectURL(formData.cover_art)}
                  alt="Cover Art Preview"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                  unoptimized
                />
              ) : existingFiles.cover_art ? (
                <Image
                  src={coverUrl}
                  alt="Cover Art"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                  unoptimized
                  priority
                />
              ) : (
                <Upload className="text-gray-500" size={32} />
              )}
            </div>
            <Input
              id="cover-art-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cover_art: e.target.files?.[0] || null,
                })
              }
            />
            <p className="text-xs text-gray-400 mt-2">
              Preferred: 1500x1500px, Minimum: 500x500px
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
