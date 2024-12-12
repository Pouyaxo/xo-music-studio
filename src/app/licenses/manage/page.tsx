"use client";

import { useState, useEffect } from "react";
import { ManagementLayout } from "@/components/management/Layout";
import { LicensesList } from "@/components/licenses/management/LicensesList";
import { LicenseEditor } from "@/components/licenses/management/LicenseEditor";
import { useDataStore } from "@/lib/store/dataStore";
import type { License } from "@/lib/types/licenseTypes";

export default function LicenseManagementPage() {
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [showNewLicense, setShowNewLicense] = useState(false);
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData("licenses", true);
  }, [fetchData]);

  const handleEditLicense = (license: License) => {
    setEditingLicense(license);
  };

  const handleBack = () => {
    setEditingLicense(null);
    setShowNewLicense(false);
  };

  const handleNewLicense = () => {
    setShowNewLicense(true);
  };

  if (editingLicense || showNewLicense) {
    return (
      <LicenseEditor
        editingLicense={editingLicense as License | undefined}
        onBack={handleBack}
      />
    );
  }

  return (
    <ManagementLayout
      title="License Management"
      onAdd={handleNewLicense}
      addButtonLabel="Add New License"
    >
      <LicensesList
        onEditLicense={handleEditLicense}
        onNewLicense={handleNewLicense}
      />
    </ManagementLayout>
  );
}
