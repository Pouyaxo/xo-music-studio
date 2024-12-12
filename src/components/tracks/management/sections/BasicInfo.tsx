"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { X } from "lucide-react";
import type { TrackFormData } from "@/lib/types/mainTypes";

interface BasicInfoProps {
  formData: TrackFormData;
  setFormData: React.Dispatch<React.SetStateAction<TrackFormData>>;
}

export function BasicInfo({ formData, setFormData }: BasicInfoProps) {
  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
      e.preventDefault();
      const newTag = (e.target as HTMLInputElement).value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        });
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleTagRemove = (indexToRemove: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove),
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>Basic details about your track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-400">TITLE*</Label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter track title"
            className="bg-zinc-900/50 border-white/10 h-12 text-white"
            maxLength={60}
          />
          <div className="text-xs text-gray-500">
            {formData.title.length} out of 60 Maximum characters allowed
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">ARTIST NAME*</Label>
          <Input
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            placeholder="Enter artist name"
            className="bg-zinc-900/50 border-white/10 h-12 text-white"
            maxLength={60}
          />
          <div className="text-xs text-gray-500">
            {formData.artist.length} out of 60 Maximum characters allowed
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">TAGS* (3)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 px-3 py-1 rounded-full flex items-center border border-white/10"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => handleTagRemove(index)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <Input
            placeholder="Type a tag and press Enter"
            className="bg-zinc-900/50 border-white/10 h-12 text-white"
            onKeyPress={handleTagAdd}
          />
          <div className="text-xs text-gray-500">
            {formData.tags.length}/25 tags
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-400">TRACK TYPE*</Label>
            <Select
              value={formData.track_type}
              onValueChange={(value) =>
                setFormData({ ...formData, track_type: value })
              }
            >
              <SelectTrigger className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border border-white/10 text-white">
                <SelectItem
                  value="Beat"
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  Beat
                </SelectItem>
                <SelectItem
                  value="Beat with Hook"
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  Beat with Hook
                </SelectItem>
                <SelectItem
                  value="Vocals"
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  Vocals
                </SelectItem>
                <SelectItem
                  value="Drums"
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  Drums
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <DateTimePicker
              date={
                formData.release_date
                  ? new Date(formData.release_date)
                  : undefined
              }
              setDate={(newDate) =>
                setFormData({
                  ...formData,
                  release_date: newDate ? newDate.toISOString() : null,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.preferences.private}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, private: !!checked },
                })
              }
            />
            <Label>Private Track</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
