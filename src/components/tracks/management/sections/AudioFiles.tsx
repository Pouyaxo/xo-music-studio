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

interface AudioFilesProps {
  formData: any;
  setFormData: (data: any) => void;
  existingFiles?: {
    cover_art: string | null;
    untagged_mp3: string | null;
    untagged_wav: string | null;
    tagged_wav: string | null;
    stems_file: string | null;
  };
}

export function AudioFiles({
  formData,
  setFormData,
  existingFiles,
}: AudioFilesProps) {
  console.log("AudioFiles component render:", {
    existingFiles,
    currentFormData: formData.audio_files,
  });

  const [convertingUntagged, setConvertingUntagged] = useState(false);
  const [convertingTagged, setConvertingTagged] = useState(false);

  const handleUntaggedFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Handling untagged file:", {
      fileName: file.name,
      type: file.type,
      existingFiles: existingFiles,
    });

    try {
      if (isWavFile(file)) {
        setConvertingUntagged(true);
        console.log("Converting WAV to MP3...");

        // Store original WAV
        setFormData({
          ...formData,
          audio_files: {
            ...formData.audio_files,
            untagged_wav: file,
          },
        });

        // Convert to MP3
        const mp3File = await convertToMp3(file);
        console.log("Conversion complete:", {
          originalFile: file.name,
          mp3FileName: mp3File.name,
        });

        setFormData((prev: typeof formData) => ({
          ...prev,
          audio_files: {
            ...prev.audio_files,
            untagged_wav: file,
            untagged_mp3: mp3File,
          },
        }));
      } else if (isMp3File(file)) {
        console.log("Handling MP3 file directly");
        setFormData({
          ...formData,
          audio_files: {
            ...formData.audio_files,
            untagged_mp3: file,
            untagged_wav: null,
          },
        });
      }
    } catch (error) {
      console.error("Error handling file:", error);
    } finally {
      setConvertingUntagged(false);
    }
  };

  const handleTaggedFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Handling tagged file:", {
      fileName: file.name,
      type: file.type,
      existingFiles: existingFiles,
    });

    try {
      if (isWavFile(file)) {
        setConvertingTagged(true);
        console.log("Converting tagged WAV to MP3...");
        const mp3File = await convertToMp3(file);
        console.log("Tagged conversion complete:", {
          originalFile: file.name,
          mp3FileName: mp3File.name,
        });

        setFormData({
          ...formData,
          audio_files: {
            ...formData.audio_files,
            tagged_wav: mp3File,
          },
        });
      } else if (isMp3File(file)) {
        console.log("Handling tagged MP3 file directly");
        setFormData({
          ...formData,
          audio_files: {
            ...formData.audio_files,
            tagged_wav: file,
          },
        });
      }
    } catch (error) {
      console.error("Error handling file:", error);
    } finally {
      setConvertingTagged(false);
    }
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Audio Files</CardTitle>
        <CardDescription>Upload your track files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Untagged Audio Section */}
          <div className="space-y-4">
            <div
              className="bg-zinc-900/50 p-4 rounded-lg cursor-pointer hover:bg-zinc-900/70 transition-colors border border-white/10"
              onClick={() =>
                !convertingUntagged &&
                !convertingTagged &&
                document.getElementById("untagged-audio-input")?.click()
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Un-Tagged WAV or MP3</h3>
                  <p className="text-sm text-gray-400">WAV & MP3 Available</p>
                  {formData.audio_files.untagged_mp3 && (
                    <p className="text-sm text-blue-400 mt-2">
                      MP3: {formData.audio_files.untagged_mp3.name}
                    </p>
                  )}
                  {formData.audio_files.untagged_wav && (
                    <p className="text-sm text-blue-400">
                      WAV: {formData.audio_files.untagged_wav.name}
                    </p>
                  )}
                  {!formData.audio_files.untagged_mp3 &&
                    existingFiles?.untagged_mp3 && (
                      <p className="text-sm text-blue-400">
                        Current MP3:{" "}
                        {existingFiles.untagged_mp3.split("/").pop()}
                      </p>
                    )}
                  {!formData.audio_files.untagged_wav &&
                    existingFiles?.untagged_wav && (
                      <p className="text-sm text-blue-400">
                        Current WAV:{" "}
                        {existingFiles.untagged_wav.split("/").pop()}
                      </p>
                    )}
                </div>
                <Upload className="text-blue-500" size={24} />
              </div>
              <Input
                id="untagged-audio-input"
                type="file"
                accept=".wav,.mp3"
                className="hidden"
                onChange={handleUntaggedFileChange}
                disabled={convertingUntagged || convertingTagged}
              />
            </div>

            {/* Tagged Audio Section */}
            <div
              className="bg-zinc-900/50 p-4 rounded-lg cursor-pointer hover:bg-zinc-900/70 transition-colors border border-white/10"
              onClick={() =>
                !convertingUntagged &&
                !convertingTagged &&
                document.getElementById("tagged-wav-input")?.click()
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tagged WAV (For Streaming)</h3>
                  <p className="text-sm text-gray-400">WAV or MP3</p>
                  {formData.audio_files.tagged_wav && (
                    <p className="text-sm text-blue-400 mt-2">
                      New file: {formData.audio_files.tagged_wav.name}
                    </p>
                  )}
                  {!formData.audio_files.tagged_wav &&
                    existingFiles?.tagged_wav && (
                      <p className="text-sm text-blue-400">
                        Current file:{" "}
                        {existingFiles.tagged_wav.split("/").pop()}
                      </p>
                    )}
                </div>
                <Upload className="text-blue-500" size={24} />
              </div>
              <Input
                id="tagged-wav-input"
                type="file"
                accept=".wav,.mp3"
                className="hidden"
                onChange={handleTaggedFileChange}
                disabled={convertingUntagged || convertingTagged}
              />
            </div>

            {/* Stems Section */}
            <div
              className="bg-zinc-900/50 p-4 rounded-lg cursor-pointer hover:bg-zinc-900/70 transition-colors border border-white/10"
              onClick={() =>
                !convertingUntagged &&
                !convertingTagged &&
                document.getElementById("stems-file-input")?.click()
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Track Stems</h3>
                  <p className="text-sm text-gray-400">.ZIP Available</p>
                  {formData.audio_files.stems_file && (
                    <p className="text-sm text-blue-400 mt-2">
                      New file: {formData.audio_files.stems_file.name}
                    </p>
                  )}
                  {!formData.audio_files.stems_file &&
                    existingFiles?.stems_file && (
                      <p className="text-sm text-blue-400">
                        Current file:{" "}
                        {existingFiles.stems_file.split("/").pop()}
                      </p>
                    )}
                </div>
                <Upload className="text-blue-500" size={24} />
              </div>
              <Input
                id="stems-file-input"
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    audio_files: {
                      ...formData.audio_files,
                      stems_file: e.target.files?.[0] || null,
                    },
                  })
                }
                disabled={convertingUntagged || convertingTagged}
              />
            </div>
          </div>

          {/* Cover Art Section */}
          <div
            className="bg-zinc-900/50 p-6 rounded-lg border border-white/10"
            onClick={() =>
              !convertingUntagged &&
              !convertingTagged &&
              document.getElementById("cover-art-input")?.click()
            }
          >
            <h3 className="font-medium mb-2">Cover Art</h3>
            <div className="aspect-square bg-black rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/70 transition-colors">
              {formData.cover_art ? (
                <Image
                  src={URL.createObjectURL(formData.cover_art)}
                  alt="Cover Art"
                  width={1500}
                  height={1500}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : existingFiles?.cover_art ? (
                <Image
                  src={getStorageUrl(existingFiles.cover_art)}
                  alt="Cover Art"
                  width={1500}
                  height={1500}
                  className="w-full h-full object-cover rounded-lg"
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
              disabled={convertingUntagged || convertingTagged}
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
