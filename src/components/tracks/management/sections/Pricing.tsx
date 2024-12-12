import React from "react";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CustomNumberInput } from "@/components/ui/CustomNumberInput";

interface PricingProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Pricing({ formData, setFormData }: PricingProps) {
  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Pricing & Downloads</CardTitle>
        <CardDescription>
          Set up your pricing and download options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-400">MP3 LICENSE PRICE</Label>
            <CustomNumberInput
              value={formData.pricing.mp3_license_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: {
                    ...formData.pricing,
                    mp3_license_price: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="mt-1"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label className="text-gray-400">WAV LICENSE PRICE</Label>
            <CustomNumberInput
              value={formData.pricing.wav_license_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: {
                    ...formData.pricing,
                    wav_license_price: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="mt-1"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Free Download Options</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableFreeDownload"
                checked={formData.free_download.enabled}
                onCheckedChange={(checked: boolean) =>
                  setFormData({
                    ...formData,
                    free_download: {
                      ...formData.free_download,
                      enabled: checked,
                    },
                  })
                }
              />
              <Label htmlFor="enableFreeDownload">Enable Free Downloads</Label>
            </div>

            {formData.free_download.enabled && (
              <div className="space-y-3 pl-6">
                <div>
                  <Label className="text-gray-400">Download Type</Label>
                  <Select
                    value={formData.free_download.download_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        free_download: {
                          ...formData.free_download,
                          download_type: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tagged MP3">Tagged MP3</SelectItem>
                      <SelectItem value="Untagged MP3">Untagged MP3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-400">Required Action</Label>
                  <Select
                    value={formData.free_download.required_action}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        free_download: {
                          ...formData.free_download,
                          required_action: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="bg-zinc-900/50 border-white/10 h-9 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Social Follow">
                        Social Follow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.free_download.required_action === "Social Follow" && (
                  <div className="space-y-2">
                    {["twitter", "soundcloud", "spotify"].map((platform) => (
                      <div
                        key={platform}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={formData.free_download.social_platforms.includes(
                            platform
                          )}
                          onCheckedChange={(checked: boolean) => {
                            const platforms = checked
                              ? [
                                  ...formData.free_download.social_platforms,
                                  platform,
                                ]
                              : formData.free_download.social_platforms.filter(
                                  (p: string) => p !== platform
                                );

                            setFormData({
                              ...formData,
                              free_download: {
                                ...formData.free_download,
                                social_platforms: platforms,
                              },
                            });
                          }}
                        />
                        <Label>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
