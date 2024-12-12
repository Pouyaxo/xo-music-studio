"use client";

import React from 'react';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface RelatedVideosProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function RelatedVideos({ formData, setFormData }: RelatedVideosProps) {
  const addVideo = () => {
    setFormData({
      ...formData,
      related_videos: [...(formData.related_videos || []), ""],
    });
  };

  const removeVideo = (index: number) => {
    const newVideos = formData.related_videos.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      related_videos: newVideos,
    });
  };

  const updateVideo = (index: number, value: string) => {
    const newVideos = [...formData.related_videos];
    newVideos[index] = value;
    setFormData({
      ...formData,
      related_videos: newVideos,
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Related Videos</CardTitle>
        <CardDescription>Add YouTube videos related to this track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(formData.related_videos || []).map((video: string, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <Label className="text-gray-400">YouTube URL {index + 1}</Label>
              <Input
                value={video}
                onChange={(e) => updateVideo(index, e.target.value)}
                className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
                placeholder="https://youtube.com/..."
              />
            </div>
            {formData.related_videos.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeVideo(index)}
                className="mt-8 bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addVideo}
          className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Video URL
        </Button>
      </CardContent>
    </Card>
  );
}