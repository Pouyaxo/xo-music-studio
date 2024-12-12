"use client";

import React from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";

interface ProfilePhotoUploadProps {
  photoUrl: string;
  displayName: string;
  firstName: string;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultView?: React.ReactNode;
}

export function ProfilePhotoUpload({
  photoUrl,
  displayName,
  firstName,
  onPhotoChange,
  defaultView,
}: ProfilePhotoUploadProps) {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <label htmlFor="photo-upload" className="cursor-pointer group relative">
          {photoUrl === "/default-avatar.jpg" ? (
            defaultView || (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                {firstName ? (
                  <span className="text-2xl font-medium text-gray-600">
                    {firstName[0]}
                  </span>
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
            )
          ) : (
            <div className="w-24 h-24 relative rounded-full overflow-hidden">
              <Image
                src={photoUrl}
                alt={displayName || "Profile photo"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload profile photo"
        />
      </div>
    </div>
  );
}
