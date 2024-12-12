"use client";

import React from "react";
import Image from "next/image";

interface CollaboratorAvatarProps {
  name: string;
  profileImage?: string | null;
}

export function CollaboratorAvatar({
  name,
  profileImage,
}: CollaboratorAvatarProps) {
  if (!name) return null;

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
      {profileImage ? (
        <Image
          src={profileImage}
          alt={name}
          width={40}
          height={40}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-lg">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
