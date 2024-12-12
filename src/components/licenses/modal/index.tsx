"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Track } from "@/lib/types/audioTypes";
import { LicenseModalHeader } from "./LicenseModalHeader";
import { LicenseOptions } from "./LicenseOptions";
import { NegotiateOption } from "./NegotiateOption";

interface LicenseModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseModal({ track, isOpen, onClose }: LicenseModalProps) {
  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[90vw] md:max-w-[800px] h-auto max-h-[90vh] bg-black border-none text-white p-0 overflow-y-auto"
        hideCloseButton
      >
        <div className="p-6 md:p-8">
          <LicenseModalHeader track={track} onClose={onClose} />
          <LicenseOptions track={track} onClose={onClose} />
          <NegotiateOption />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { LicenseOptions } from "./LicenseOptions";
export { LicenseFeatures } from "./LicenseFeatures";
export { LicenseModalHeader } from "./LicenseModalHeader";
export { NegotiateOption } from "./NegotiateOption";
