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
import { CustomNumberInput } from "@/components/ui/CustomNumberInput";

interface BasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function BasicInfo({ formData, setFormData }: BasicInfoProps) {
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
    setFormData({
      ...formData,
      tags: formData.tags.filter(
        (_: string, index: number) => index !== indexToRemove
      ),
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>Basic details about your sound kit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-400">TITLE*</Label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter sound kit title"
            className="bg-zinc-900/50 border-white/10 h-9 text-white"
            maxLength={60}
            required
          />
          <div className="text-xs text-gray-500">
            {formData.title.length} out of 60 Maximum characters allowed
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">ARTIST*</Label>
          <Input
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            placeholder="Enter artist name"
            className="bg-zinc-900/50 border-white/10 h-9 text-white"
            maxLength={60}
            required
          />
          <div className="text-xs text-gray-500">
            {formData.artist.length} out of 60 Maximum characters allowed
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">PRICE (USD)*</Label>
          <CustomNumberInput
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value ? parseFloat(e.target.value) : "",
              })
            }
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">TAGS</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag: string, index: number) => (
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
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagAdd}
            placeholder="Type a tag and press Enter"
            className="bg-zinc-900/50 border-white/10 h-9 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
