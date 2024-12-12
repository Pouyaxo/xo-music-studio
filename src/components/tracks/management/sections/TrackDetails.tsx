import React from "react";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CustomNumberInput } from "@/components/ui/CustomNumberInput";

interface TrackDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function TrackDetails({ formData, setFormData }: TrackDetailsProps) {
  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Track Details</CardTitle>
        <CardDescription>
          Additional information about your track
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-400">PRIMARY GENRE*</Label>
            <Select
              value={formData.details.primaryGenre}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, primaryGenre: value },
                })
              }
            >
              <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9 text-white mt-1">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="R&B">R&B</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Trap">Trap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-400">SUBGENRE</Label>
            <Select
              value={formData.details.subgenre}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, subgenre: value },
                })
              }
            >
              <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9 text-white mt-1">
                <SelectValue placeholder="Select subgenre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trap">Trap</SelectItem>
                <SelectItem value="Drill">Drill</SelectItem>
                <SelectItem value="Boom Bap">Boom Bap</SelectItem>
                <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-gray-400">DESCRIPTION</Label>
          <Textarea
            value={formData.details.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                details: {
                  ...formData.details,
                  description: e.target.value,
                },
              })
            }
            placeholder="Describe your track..."
            className="bg-zinc-900/50 border-white/10 text-white mt-1 min-h-[120px]"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.details.description.length} out of 500 characters
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-400">BPM</Label>
            <CustomNumberInput
              value={formData.details.bpm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, bpm: e.target.value },
                })
              }
              className="mt-1"
              placeholder="e.g., 140"
            />
          </div>

          <div>
            <Label className="text-gray-400">KEY</Label>
            <Select
              value={formData.details.key}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, key: value },
                })
              }
            >
              <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9 text-white mt-1">
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="C#">C#</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="D#">D#</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="F">F</SelectItem>
                <SelectItem value="F#">F#</SelectItem>
                <SelectItem value="G">G</SelectItem>
                <SelectItem value="G#">G#</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="A#">A#</SelectItem>
                <SelectItem value="B">B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
