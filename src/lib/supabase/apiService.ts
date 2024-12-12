import { supabase } from './supabaseClient';
import { retryableFetch } from '../utils/fetchUtils';
import type { Track } from '../types/audioTypes';
import type { Playlist } from '../types/playlistTypes';

export async function fetchTracks() {
  return retryableFetch(async () => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Track[];
  });
}

export async function fetchTrackById(id: string) {
  return retryableFetch(async () => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Track;
  });
}

export async function fetchUserPlaylists(userId: string) {
  return retryableFetch(async () => {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Playlist[];
  });
}

export async function createTrack(track: Omit<Track, 'id'>) {
  return retryableFetch(async () => {
    const { data, error } = await supabase
      .from('tracks')
      .insert([track])
      .select()
      .single();

    if (error) throw error;
    return data as Track;
  });
}

export async function updateTrack(id: string, updates: Partial<Track>) {
  return retryableFetch(async () => {
    const { data, error } = await supabase
      .from('tracks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Track;
  });
}

export async function deleteTrack(id: string) {
  return retryableFetch(async () => {
    const { error } = await supabase
      .from('tracks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  });
}