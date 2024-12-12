"use client";

import React from "react";
import { License } from "@/lib/types/licenseTypes";

interface LicenseFeaturesProps {
  features: License["features"];
}

export function LicenseFeatures({ features }: LicenseFeaturesProps) {
  return (
    <div className="p-4 border-t border-[#222222]">
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-300">
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
