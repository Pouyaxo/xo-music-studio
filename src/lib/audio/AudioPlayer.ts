import { Track, AudioPlayerState } from '../types/audioTypes';

export class AudioPlayer {
  private audio: HTMLAudioElement;
  private state: AudioPlayerState;

  constructor() {
    this.audio = new Audio();
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
      currentTrack: null,
    };

    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.state.currentTime = this.audio.currentTime;
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audio.duration;
    });

    this.audio.addEventListener('ended', () => {
      this.state.isPlaying = false;
    });
  }

  async play(track?: Track) {
    if (track && track !== this.state.currentTrack) {
      this.audio.src = track.file_path || '';
      this.state.currentTrack = track;
      await this.audio.load();
    }
    
    await this.audio.play();
    this.state.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.state.isPlaying = false;
  }

  seek(time: number) {
    this.audio.currentTime = time;
    this.state.currentTime = time;
  }

  setVolume(value: number) {
    this.audio.volume = value;
    this.state.volume = value;
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.state.muted = this.audio.muted;
  }

  getState(): AudioPlayerState {
    return { ...this.state };
  }
}