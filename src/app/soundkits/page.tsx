"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SoundKitsSection } from "@/components/sound-kits/display/SoundKitsSection";
import { useState } from "react";

export default function SoundKitsPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-16">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <SoundKitsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
