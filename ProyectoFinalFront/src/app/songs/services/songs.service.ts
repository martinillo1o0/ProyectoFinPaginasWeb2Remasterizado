import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Song, SongResponse } from '@songs/interfaces/song.interface';

@Injectable({ providedIn: 'root' })
export class SongsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getSongs(limit = 12, offset = 0, genre?: string): Observable<SongResponse> {
    const params: Record<string, string | number> = { limit, offset };
    if (genre) params['genre'] = genre;
    return this.http.get<SongResponse>(`${this.baseUrl}/songs`, { params });
  }

  getSongByIdSlug(idSlug: string): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/songs/${idSlug}`);
  }
}
