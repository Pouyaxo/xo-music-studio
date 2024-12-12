"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface CollaboratorsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Collaborators({ formData, setFormData }: CollaboratorsProps) {
  const addCollaborator = () => {
    setFormData({
      ...formData,
      collaborators: [
        ...formData.collaborators,
        { name: "", role: "", shares: "" },
      ],
    });
  };

  const removeCollaborator = (index: number) => {
    const newCollaborators = formData.collaborators.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({
      ...formData,
      collaborators: newCollaborators,
    });
  };

  const updateCollaborator = (index: number, field: string, value: string) => {
    const newCollaborators = [...formData.collaborators];
    newCollaborators[index] = {
      ...newCollaborators[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      collaborators: newCollaborators,
    });
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Collaborators</CardTitle>
        <CardDescription>
          Add people who contributed to this track
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.collaborators.map((collaborator: any, index: number) => (
          <div
            key={index}
            className="bg-zinc-900/50 p-4 rounded-lg space-y-4 border border-white/10"
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-400">Name</Label>
                <Input
                  value={collaborator.name}
                  onChange={(e) =>
                    updateCollaborator(index, "name", e.target.value)
                  }
                  className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
                  placeholder="Collaborator name"
                />
              </div>
              <div>
                <Label className="text-gray-400">Role</Label>
                <Input
                  value={collaborator.role}
                  onChange={(e) =>
                    updateCollaborator(index, "role", e.target.value)
                  }
                  className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
                  placeholder="e.g., Producer"
                />
              </div>
              <div>
                <Label className="text-gray-400">Shares (%)</Label>
                <Input
                  type="number"
                  value={collaborator.shares}
                  onChange={(e) =>
                    updateCollaborator(index, "shares", e.target.value)
                  }
                  className="bg-zinc-900/50 border-white/10 h-12 text-white mt-2"
                  placeholder="e.g., 50"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            {formData.collaborators.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCollaborator(index)}
                className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Collaborator
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addCollaborator}
          className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collaborator
        </Button>
      </CardContent>
    </Card>
  );
}
