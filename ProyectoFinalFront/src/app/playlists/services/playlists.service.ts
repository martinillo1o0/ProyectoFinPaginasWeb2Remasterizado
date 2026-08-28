import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  songIds: string[];
}

export interface PlaylistResponse {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  items: { id: string; position: number; song: { id: string; title: string; artist: string } }[];
}

@Injectable({ providedIn: 'root' })
export class PlaylistsService {
  private readonly http = inject(HttpClient);

  createPlaylist(request: CreatePlaylistRequest) {
    return this.http.post<PlaylistResponse>(`${environment.baseUrl}/playlists`, request);
  }
}
