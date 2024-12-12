"use client";

import React from "react";
import { CollaboratorAvatar } from "@/components/tracks/details/CollaboratorAvatar";
import { CollaboratorInfo } from "@/components/tracks/details/CollaboratorInfo";

interface Collaborator {
  id: string;
  name: string;
  // Make role optional since it's not in our data
  role?: string;
  profileImage?: string;
  shares?: string;
}

interface SoundKitCollaboratorsProps {
  collaborators?: Array<{
    id: string;
    name: string;
    role?: string;
    profileImage?: string;
    shares?: string;
  }>;
}

export function SoundKitCollaborators({
  collaborators,
}: SoundKitCollaboratorsProps) {
  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Collaborators</h2>
      <div className="flex flex-wrap gap-4">
        {collaborators.map((collaborator, index) => (
          <div
            key={`${collaborator.name}-${index}`}
            className="flex items-center gap-3"
          >
            <CollaboratorAvatar
              name={collaborator.name}
              profileImage={collaborator.profileImage}
            />
            <CollaboratorInfo
              name={collaborator.name}
              role={collaborator.role || "Collaborator"}
              shares={collaborator.shares}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
