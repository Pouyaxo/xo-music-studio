"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfilePhotoProps {
  photoUrl: string | null;
  displayName: string;
  firstName: string;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePhoto({ photoUrl, displayName, firstName, onPhotoChange }: ProfilePhotoProps) {
  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2A2A2A]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt="Profile"
            width={96}
            height={96}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
            {displayName?.charAt(0) || firstName?.charAt(0) || "?"}
          </div>
        )}
      </div>
      <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
        <Camera className="w-4 h-4" />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onPhotoChange}
        />
      </label>
    </div>
  );
}