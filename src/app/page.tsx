import { Suspense } from "react";

import { Playlist } from "@/components/audio/playlist/PlaylistView";
import { MainLicensingInfo } from "@/components/licenses/info/MainLicensingInfo";
import { SoundKitsSection } from "@/components/sound-kits/display/SoundKitsSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { BottomPlayer } from "@/components/audio/player/BottomPlayer";
import { HeroSection } from "@/components/hero/HeroSection";
import { supabase } from "@/lib/supabase/supabaseClient";

// Server component
async function getData() {
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: licenses } = await supabase
    .from("licenses")
    .select("*")
    .order("order", { ascending: true });

  const { data: soundKits } = await supabase
    .from("sound_kits")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    tracks:
      tracks?.map((track) => ({
        ...track,
        release_date: track.release_date?.toString(),
        user_id: track.user_id || "",
      })) || [],
    licenses: licenses || [],
    soundKits: soundKits || [],
  };
}

export default async function Home() {
  const initialData = await getData();

  return (
    <main className="relative  bg-black">
      <div className="w-full">
        <HeroSection />
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <Suspense fallback={null}>
            <Playlist initialData={initialData} />
          </Suspense>
        </div>
      </div>

      <div className="w-full">
        <MainLicensingInfo />
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="max-w-[1200px] mx-auto">
          <SoundKitsSection />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="max-w-[1200px] mx-auto">
          <ContactForm />
        </div>
      </div>

      <Footer />
      <BottomPlayer />
    </main>
  );
}
