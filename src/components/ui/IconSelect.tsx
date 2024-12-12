"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Mic, Radio, Video, Music, Share2, Download } from "lucide-react";

const AVAILABLE_ICONS = {
  Mic: "Mic",
  Radio: "Radio",
  Video: "Video",
  Music: "Music",
  Share2: "Share2",
  Download: "Download",
} as const;

interface IconSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function IconSelect({ value, onChange }: IconSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select icon" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(AVAILABLE_ICONS).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            <div className="flex items-center gap-2">
              {React.createElement(eval(key), { className: "w-4 h-4" })}
              <span>{value}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
