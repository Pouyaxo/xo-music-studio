"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { X } from "lucide-react";
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

interface GeneralInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function GeneralInfo({ formData, setFormData }: GeneralInfoProps) {
  const [tagInput, setTagInput] = useState("");

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();

      const currentTags = Array.isArray(formData.tags) ? formData.tags : [];

      if (!currentTags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...currentTags, tagInput.trim()],
        });
      }

      setTagInput("");
    }
  };

  const handleTagRemove = (indexToRemove: number) => {
    const currentTags = Array.isArray(formData.tags) ? formData.tags : [];
    setFormData({
      ...formData,
      tags: currentTags.filter((_: string, index: number) => index !== indexToRemove),
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">General Information</CardTitle>
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
            {(Array.isArray(formData.tags) ? formData.tags : []).map(
              (tag: string, index: number) => (
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
              )
            )}
          </div>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagAdd}
            placeholder="Type a tag and press Enter"
            className="bg-zinc-900/50 border-white/10 h-12 text-white"
          />
          <div className="text-xs text-gray-500">
            {Array.isArray(formData.tags) ? formData.tags.length : 0}/25 tags
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
              <SelectContent>
                <SelectItem value="Beat">Beat</SelectItem>
                <SelectItem value="Beat with Hook">Beat with Hook</SelectItem>
                <SelectItem value="Vocals">Vocals</SelectItem>
                <SelectItem value="Drums">Drums</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-400">RELEASE DATE*</Label>
            <Input
              type="datetime-local"
              value={formData.release_date || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  release_date: e.target.value || null,
                })
              }
              className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
