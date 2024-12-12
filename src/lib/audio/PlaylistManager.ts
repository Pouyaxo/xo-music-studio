// src/lib/audio/playlist-manager.ts

import { Track } from '../types/audioTypes';
import { Playlist, PlaylistTrack } from '../types/playlistTypes';

export class PlaylistManager {
  private playlists: Map<string, Playlist>;
  private trackMap: Map<string, PlaylistTrack[]>;

  constructor() {
    this.playlists = new Map();
    this.trackMap = new Map();
  }

  addPlaylist(playlist: Playlist) {
    this.playlists.set(playlist.id, playlist);
  }

  removePlaylist(playlistId: string) {
    this.playlists.delete(playlistId);
    this.trackMap.delete(playlistId);
  }

  addTrackToPlaylist(playlistId: string, track: Track, position: number) {
    const playlistTracks = this.trackMap.get(playlistId) || [];
    const newTrack: PlaylistTrack = {
      id: `${playlistId}-${track.id}`,
      playlist_id: playlistId,
      track_id: track.id,
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    playlistTracks.push(newTrack);
    this.trackMap.set(playlistId, playlistTracks);
  }

  getPlaylistTracks(playlistId: string): PlaylistTrack[] {
    return this.trackMap.get(playlistId) || [];
  }

  updateTrackPosition(playlistId: string, trackId: string, newPosition: number) {
    const tracks = this.trackMap.get(playlistId);
    if (!tracks) return;

    const trackIndex = tracks.findIndex(t => t.track_id === trackId);
    if (trackIndex === -1) return;

    const track = tracks[trackIndex];
    tracks.splice(trackIndex, 1);
    tracks.splice(newPosition, 0, {
      ...track,
      position: newPosition,
      updated_at: new Date().toISOString()
    });

    this.trackMap.set(playlistId, tracks);
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string) {
    const tracks = this.trackMap.get(playlistId);
    if (!tracks) return;

    const filteredTracks = tracks.filter(t => t.track_id !== trackId);
    this.trackMap.set(playlistId, filteredTracks);
  }
}
