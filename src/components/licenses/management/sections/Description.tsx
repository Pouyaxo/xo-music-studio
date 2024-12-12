"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { LicenseFormData } from "@/lib/types/licenseTypes";

interface DescriptionProps {
  formData: LicenseFormData;
  setFormData: (data: LicenseFormData) => void;
}

export function Description({ formData, setFormData }: DescriptionProps) {
  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Settings</CardTitle>
        <CardDescription>
          Configure license settings and requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.allow_profit_performances}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  allow_profit_performances: !!checked,
                })
              }
            />
            <Label>Allow For-Profit Live Performances</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.require_tagging}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, require_tagging: !!checked })
              }
            />
            <Label>Require Track Tagging</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.require_credit}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, require_credit: !!checked })
              }
            />
            <Label>Require Producer Credit</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.is_enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_enabled: !!checked })
              }
            />
            <Label>Enable License</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: !!checked })
              }
            />
            <Label>Featured License</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.default_for_new_tracks}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, default_for_new_tracks: !!checked })
              }
            />
            <Label>Set as Default for New Tracks</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Custom Terms</Label>
          <Textarea
            value={formData.custom_terms || ""}
            onChange={(e) =>
              setFormData({ ...formData, custom_terms: e.target.value })
            }
            placeholder="Enter any additional terms..."
            className="bg-zinc-900/50 border-white/10 min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
