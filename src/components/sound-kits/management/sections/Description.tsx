"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface DescriptionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Description({ formData, setFormData }: DescriptionProps) {
  const [featureInput, setFeatureInput] = useState("");

  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      const currentFeatures = Array.isArray(formData.features) ? formData.features : [];
      if (!currentFeatures.includes(featureInput.trim())) {
        setFormData({
          ...formData,
          features: [...currentFeatures, featureInput.trim()]
        });
      }
      setFeatureInput("");
    }
  };

  const handleFeatureRemove = (indexToRemove: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_: string, index: number) => index !== indexToRemove)
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Description & Features</CardTitle>
        <CardDescription>Describe your sound kit and list its features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-400">DESCRIPTION</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your sound kit..."
            className="bg-zinc-900/50 border-white/10 text-white mt-2 min-h-[120px]"
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length} out of 1000 characters
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">FEATURES</Label>
          <div className="space-y-2">
            {formData.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-white/10">
                <span className="flex-1">{feature}</span>
                <button
                  onClick={() => handleFeatureRemove(index)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={handleFeatureAdd}
            placeholder="Type a feature and press Enter"
            className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}