"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CustomNumberInput } from "@/components/ui/CustomNumberInput";
import { Label } from "@/components/ui/Label";
import type { LicenseFormData } from "@/lib/types/licenseTypes";

interface MediaFilesProps {
  formData: LicenseFormData;
  setFormData: (data: LicenseFormData) => void;
}

export function MediaFiles({ formData, setFormData }: MediaFilesProps) {
  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">License Terms</CardTitle>
        <CardDescription>
          Define the terms and limitations of the license
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Distribution Limit</Label>
            <CustomNumberInput
              value={formData.distribution_limit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  distribution_limit: parseInt(e.target.value) || undefined,
                })
              }
              min="0"
              className="mt-1"
              placeholder="Unlimited if empty"
            />
          </div>

          <div>
            <Label>Streaming Limit</Label>
            <CustomNumberInput
              value={formData.streaming_limit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  streaming_limit: parseInt(e.target.value) || undefined,
                })
              }
              min="0"
              className="mt-1"
              placeholder="Unlimited if empty"
            />
          </div>

          <div>
            <Label>Music Video Limit</Label>
            <CustomNumberInput
              value={formData.music_video_limit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  music_video_limit: parseInt(e.target.value) || undefined,
                })
              }
              min="0"
              className="mt-1"
              placeholder="Unlimited if empty"
            />
          </div>

          <div>
            <Label>Radio Station Limit</Label>
            <CustomNumberInput
              value={formData.radio_station_limit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  radio_station_limit: parseInt(e.target.value) || undefined,
                })
              }
              min="0"
              className="mt-1"
              placeholder="Unlimited if empty"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
