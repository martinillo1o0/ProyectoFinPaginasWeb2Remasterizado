import { User } from '@auth/interfaces/user.interface';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface SongResponse {
  count: number;
  pages: number;
  songs: Song[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  description: string;
  slug: string;
  durationSeconds: number;
  releaseYear: number;
  coverUrl?: string;
  tags: string[];
  genre: Genre;
  user: User;
}
