"use client";

import React from "react";
import { CollaboratorAvatar } from "./CollaboratorAvatar";
import { CollaboratorInfo } from "./CollaboratorInfo";

interface CollaboratorCardProps {
  name: string;
  role?: string;
  shares?: string | null;
  profileImage?: string;
}

interface TrackCollaboratorsProps {
  collaborators?: CollaboratorCardProps[] | null;
}

export function TrackCollaborators({ collaborators }: TrackCollaboratorsProps) {
  if (!collaborators || collaborators.length === 0) {
    return null;
  }

  const validCollaborators = collaborators.filter(
    (collab) =>
      collab && typeof collab === "object" && collab.name && collab.role
  );

  if (validCollaborators.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Collaborators</h2>
      <div className="flex flex-wrap gap-4">
        {validCollaborators.map((collaborator, index) => (
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
              role={collaborator.role}
              shares={collaborator.shares || undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
