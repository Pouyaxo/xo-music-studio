// src/lib/events/audio-events.ts
import EventEmitter from "events";
import type { Track } from "@/lib/types/audioTypes";

type AudioEvents = {
  trackSelected: (track: Track) => void;
  playlistUpdated: (tracks: Track[]) => void;
  playbackStateChanged: (isPlaying: boolean) => void;
}

declare interface TypedEventEmitter {
  emit<K extends keyof AudioEvents>(event: K, ...args: Parameters<AudioEvents[K]>): boolean;
  on<K extends keyof AudioEvents>(event: K, listener: AudioEvents[K]): this;
  off<K extends keyof AudioEvents>(event: K, listener: AudioEvents[K]): this;
}

class TypedEmitter extends EventEmitter implements TypedEventEmitter {}

const eventEmitter = new TypedEmitter();

export const events = {
  emit: <K extends keyof AudioEvents>(event: K, ...args: Parameters<AudioEvents[K]>) => 
    eventEmitter.emit(event, ...args),
  on: <K extends keyof AudioEvents>(event: K, listener: AudioEvents[K]) => 
    eventEmitter.on(event, listener),
  off: <K extends keyof AudioEvents>(event: K, listener: AudioEvents[K]) => 
    eventEmitter.off(event, listener)
};