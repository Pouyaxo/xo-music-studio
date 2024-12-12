"use client";

import React from "react";

interface CollaboratorInfoProps {
  name: string;
  role?: string;
  shares?: string | null;
}

export function CollaboratorInfo({
  name,
  role,
  shares,
}: CollaboratorInfoProps) {
  if (!name || !role) return null;

  return (
    <div>
      <div className="font-medium text-white">{name}</div>
      <div className="text-sm text-gray-400">
        {role}
        {shares && ` • ${shares}%`}
      </div>
    </div>
  );
}
