import { computed, effect, Injectable, signal } from '@angular/core';
import { Song } from '@songs/interfaces/song.interface';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private readonly storageKey = 'marti-music-draft-playlist';
  readonly songs = signal<Song[]>(this.readSongs());
  readonly totalSongs = computed(() => this.songs().length);
  readonly totalDuration = computed(() => this.songs().reduce((total, song) => total + song.durationSeconds, 0));

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.songs()));
    });
  }

  add(song: Song): void {
    if (this.songs().some((current) => current.id === song.id)) return;
    this.songs.update((songs) => [...songs, song]);
  }

  remove(songId: string): void {
    this.songs.update((songs) => songs.filter((song) => song.id !== songId));
  }

  clear(): void {
    this.songs.set([]);
  }

  contains(songId: string): boolean {
    return this.songs().some((song) => song.id === songId);
  }

  private readSongs(): Song[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as Song[];
    } catch {
      return [];
    }
  }
}
