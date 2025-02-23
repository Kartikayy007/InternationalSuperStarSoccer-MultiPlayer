'use client';

export class AudioManager {
  private music: HTMLAudioElement;

  constructor() {
    this.music = new Audio('/assets/Audio/background-music.mp3');
    this.music.loop = true;
  }

  startMusic() {
    this.music.play().catch(() => {
      // Handle autoplay restrictions
      console.log('Music autoplay blocked. Click to start music.');
    });
  }

  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
  }
} 