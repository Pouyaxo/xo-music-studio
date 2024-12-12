import Link from "next/link";
import Image from "next/image";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import type { SoundKit } from "@/lib/types/soundKitTypes";

interface SoundKitRowProps {
  soundKit: SoundKit;
}

export function SoundKitRow({ soundKit }: SoundKitRowProps) {
  const coverArtUrl = getStorageUrl(soundKit.cover_art || null);

  return (
    <Link
      href={`/soundkits/${soundKit.id}`}
      className="block p-4 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={coverArtUrl}
            alt={soundKit.title}
            fill
            className="rounded object-cover"
          />
        </div>
        <div>
          <h3>{soundKit.title}</h3>
          <p>${soundKit.price}</p>
        </div>
      </div>
    </Link>
  );
}
