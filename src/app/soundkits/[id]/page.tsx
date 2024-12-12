"use client";

import { supabase } from "@/lib/supabase/supabaseClient";
import { SoundKitDetails } from "@/components/sound-kits/details/SoundKitDetails";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SoundKit } from "@/lib/types/soundKitTypes";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SoundKitPage() {
  const params = useParams();
  const [soundKit, setSoundKit] = useState<SoundKit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSoundKitData() {
      const { data: soundKit, error } = await supabase
        .from("sound_kits")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (!error) {
        setSoundKit(soundKit as SoundKit);
      }
      setLoading(false);
    }

    getSoundKitData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!soundKit) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sound Kit Not Found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <SoundKitDetails soundKit={soundKit} />
      <Footer />
    </div>
  );
}
