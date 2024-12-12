"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
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
import { CustomNumberInput } from "@/components/ui/CustomNumberInput";
import { Checkbox } from "@/components/ui/Checkbox";
import type { LicenseFormData } from "@/lib/types/licenseTypes";

interface BasicInfoProps {
  formData: LicenseFormData;
  setFormData: (data: LicenseFormData) => void;
}

export function BasicInfo({ formData, setFormData }: BasicInfoProps) {
  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>Basic details about the license</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>License Name*</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., MP3 LEASE"
            className="bg-zinc-900/50 border-white/10 h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>License Type*</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "non-exclusive" | "exclusive") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price (USD)*</Label>
            <CustomNumberInput
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              min="0"
              step="0.01"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Included Files*</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.file_types.includes("MP3")}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    file_types: checked
                      ? [...formData.file_types, "MP3"]
                      : formData.file_types.filter((t) => t !== "MP3"),
                  });
                }}
              />
              <Label>MP3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.file_types.includes("WAV")}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    file_types: checked
                      ? [...formData.file_types, "WAV"]
                      : formData.file_types.filter((t) => t !== "WAV"),
                  });
                }}
              />
              <Label>WAV</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.file_types.includes("Stems")}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    file_types: checked
                      ? [...formData.file_types, "Stems"]
                      : formData.file_types.filter((t) => t !== "Stems"),
                  });
                }}
              />
              <Label>Track Stems</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.file_types.includes("Tagged")}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    file_types: checked
                      ? [...formData.file_types, "Tagged"]
                      : formData.file_types.filter((t) => t !== "Tagged"),
                  });
                }}
              />
              <Label>Tagged Audio</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
