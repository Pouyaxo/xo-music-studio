"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/account/ProfileSection";
import { CredentialsSection } from "@/components/account/CredentialsSection";
import { SocialSection } from "@/components/account/SocialSection";
import { useAuthStore } from "@/lib/store/authStore";

type Tab = "profile" | "credentials" | "social";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { user, refreshSession } = useAuthStore();

  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "credentials":
        return <CredentialsSection />;
      case "social":
        return <SocialSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar Navigation */}
      <div className="col-span-3">
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
              activeTab === "profile"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
              activeTab === "credentials"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Credentials
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
              activeTab === "social"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Social Media
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="col-span-9">
        {renderSection()}
      </div>
    </div>
  );
}