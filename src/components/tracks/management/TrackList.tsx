"use client";

import { useState, useEffect } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { Star, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import type { Track } from "@/lib/types/audioTypes";
import { STORAGE_BUCKETS } from "@/lib/utils/storageUtils";

interface Props {
  onEditTrack: (track: Track) => void;
  onNewTrack: () => void;
}

export function TrackList({ onEditTrack, onNewTrack }: Props) {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const tracks = useDataStore((state) => state.tracks);
  const error = useDataStore((state) => state.error.tracks);
  const fetchData = useDataStore((state) => state.fetchData);
  const invalidateData = useDataStore((state) => state.invalidateData);

  useEffect(() => {
    const loadTracks = async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading tracks:", error);
        return;
      }

      if (data) {
        const tracksWithUserId = data.map((track) => ({
          ...track,
          user_id: track.user_id || "",
        }));
        useDataStore.setState({ tracks: tracksWithUserId });
      }
    };

    loadTracks();
  }, []);

  const deleteTrackFiles = async (track: Track) => {
    if (!track.id) return;

    try {
      console.log("Track being deleted:", {
        trackId: track.id,
        userId: track.user_id,
        coverArt: track.cover_art,
        untaggedMp3: track.untagged_mp3,
        taggedWav: track.tagged_wav,
        stemsFile: track.stems_file,
      });

      const trackIds = new Set<string>();
      trackIds.add(track.id);

      [track.untagged_mp3, track.tagged_wav, track.stems_file, track.cover_art]
        .filter(Boolean)
        .forEach((path) => {
          if (path) {
            const pathParts = path.split("/");
            if (pathParts.length >= 4) {
              trackIds.add(pathParts[2]);
            }
          }
        });

      console.log("Track IDs to check:", Array.from(trackIds));

      const buckets = [
        STORAGE_BUCKETS.TRACKS,
        STORAGE_BUCKETS.STEMS,
        STORAGE_BUCKETS.COVERS,
      ];

      for (const bucket of buckets) {
        for (const trackId of Array.from(trackIds)) {
          try {
            const folderPath = `${track.user_id}/${trackId}`;
            console.log(`Checking folder: ${bucket}/${folderPath}`);

            const { data: files, error: listError } = await supabase.storage
              .from(bucket)
              .list(folderPath);

            if (listError) {
              console.error(
                `Error listing files in ${bucket}/${folderPath}:`,
                listError
              );
              continue;
            }

            if (files && files.length > 0) {
              const filePaths = files.map(
                (file) => `${folderPath}/${file.name}`
              );
              console.log(`Deleting files in ${bucket}:`, filePaths);

              const { error: deleteError } = await supabase.storage
                .from(bucket)
                .remove(filePaths);

              if (deleteError) {
                console.error(
                  `Error deleting files from ${bucket}/${folderPath}:`,
                  deleteError
                );
              } else {
                console.log(
                  `Successfully deleted folder ${bucket}/${folderPath}`
                );
              }
            }
          } catch (error) {
            console.error(`Error processing ${bucket}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in deleteTrackFiles:", error);
    }
  };

  const handleDelete = async (track: Track) => {
    try {
      await deleteTrackFiles(track);

      const { error } = await supabase
        .from("tracks")
        .delete()
        .eq("id", track.id);

      if (error) throw error;

      toast.success("Track deleted successfully");
      invalidateData("tracks");
      await fetchData("tracks", true);
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Failed to delete track");
    }
  };

  const handleBulkDelete = async (trackIds: string[]) => {
    try {
      const tracksToDelete = tracks.filter((track) =>
        trackIds.includes(track.id)
      );

      await Promise.all(tracksToDelete.map((track) => deleteTrackFiles(track)));

      const { error } = await supabase
        .from("tracks")
        .delete()
        .in("id", trackIds);

      if (error) throw error;

      toast.success("Selected tracks deleted successfully");
      setSelectedTracks([]);
      invalidateData("tracks");
      await fetchData("tracks", true);
    } catch (error) {
      console.error("Error deleting tracks:", error);
      toast.error("Failed to delete selected tracks");
    }
  };

  const handleDeleteClick = (track: Track) => {
    setTrackToDelete(track);
    setDeleteDialogOpen(true);
  };

  const sortedTracks = tracks;

  if (error) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-200 text-black rounded-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="mb-4">No tracks available</p>
        <Button
          onClick={onNewTrack}
          className="bg-white hover:bg-gray-200 text-black rounded-full"
        >
          Add Your First Track
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header section */}
      <div className="text-[12px] uppercase tracking-wider font-medium text-neutral-500 mb-2">
        <div className="grid grid-cols-[24px,10px,1fr,120px] sm:grid-cols-[24px,10px,minmax(100px,0.5fr),minmax(100px,4fr),120px] gap-2 px-4">
          <div></div>
          <div className="flex items-center justify-center">
            <div className="w-4 h-4" />
          </div>
          <div className="flex items-center truncate">TITLE</div>
          <div className="hidden sm:flex items-center">ARTIST</div>
          <div></div>
        </div>
      </div>

      {/* Track items */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {sortedTracks.map((track) => (
            <div
              key={track.id}
              className="h-[70px] grid grid-cols-[24px,10px,1fr,120px] sm:grid-cols-[24px,10px,minmax(100px,0.5fr),minmax(100px,4fr),120px] items-center gap-2 px-4 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedTracks.includes(track.id)}
                  onCheckedChange={() => {
                    setSelectedTracks((prev) =>
                      prev.includes(track.id)
                        ? prev.filter((id) => id !== track.id)
                        : [...prev, track.id]
                    );
                  }}
                />
              </div>
              <div></div>

              <div className="flex items-center text-[14px] text-white truncate min-w-0 pr-5">
                {track.title}
              </div>

              <div className="hidden sm:flex items-center text-[14px] text-zinc-400 truncate min-w-0">
                {track.artist}
              </div>

              <div className="flex items-center justify-end gap-1 min-w-[120px]">
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from("tracks")
                        .update({
                          is_featured: !track.is_featured,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", track.id);

                      if (error) throw error;

                      invalidateData("tracks");
                      await fetchData("tracks", true);

                      toast.success(
                        track.is_featured
                          ? "Track unfeatured"
                          : "Track featured"
                      );
                    } catch (error) {
                      console.error(
                        "Error updating track featured status:",
                        error
                      );
                      toast.error("Failed to update track status");
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      track.is_featured
                        ? "fill-white text-white"
                        : "text-white-600"
                    }`}
                  />
                </button>
                <button
                  onClick={() => onEditTrack(track)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-white hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => handleDeleteClick(track)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection panel */}
      {selectedTracks.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
          <Check className="w-4 h-4" />
          <span>{selectedTracks.length} selected</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTracks(tracks.map((track) => track.id))}
            className="text-black hover:text-black/50"
          >
            Select All
          </Button>

          <div className="h-4 w-px bg-black/20" />

          <button
            onClick={() => setBulkDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTrackToDelete(null);
        }}
        onConfirm={async () => {
          if (trackToDelete) {
            await handleDelete(trackToDelete);
            setDeleteDialogOpen(false);
            setTrackToDelete(null);
          }
        }}
        title="Delete Track"
        description="Are you sure you want to delete this track? This action cannot be undone and will delete all associated files."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={async () => {
          await handleBulkDelete(selectedTracks);
          setBulkDeleteDialogOpen(false);
        }}
        title="Delete Selected Tracks"
        description={`Are you sure you want to delete ${selectedTracks.length} tracks? This action cannot be undone and will delete all associated files.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
