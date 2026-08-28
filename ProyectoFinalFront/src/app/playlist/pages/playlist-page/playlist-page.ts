import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { PlaylistService } from '@playlist/services/playlist.service';
import { PlaylistsService, PlaylistResponse } from '@playlists/services/playlists.service';
import { SongCoverPipe } from '@songs/pipes/song-cover.pipe';

@Component({
  selector: 'app-playlist-page',
  imports: [RouterLink, SongCoverPipe],
  templateUrl: './playlist-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistPage {
  readonly playlist = inject(PlaylistService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly playlistsApi = inject(PlaylistsService);

  readonly name = signal('Mi playlist');
  readonly description = signal('Selección creada desde Marti Music');
  readonly isPublic = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly createdPlaylist = signal<PlaylistResponse | null>(null);

  durationLabel(): string {
    const total = this.playlist.totalDuration();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes} min ${seconds} s`;
  }

  createPlaylist(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/playlist' } });
      return;
    }
    if (!this.name().trim() || this.playlist.songs().length === 0) return;

    this.submitting.set(true);
    this.errorMessage.set('');
    this.playlistsApi.createPlaylist({
      name: this.name().trim(),
      description: this.description().trim() || undefined,
      isPublic: this.isPublic(),
      songIds: this.playlist.songs().map((song) => song.id),
    }).subscribe({
      next: (playlist) => {
        this.createdPlaylist.set(playlist);
        this.playlist.clear();
        this.submitting.set(false);
      },
      error: (error) => {
        const message = error.error?.message;
        this.errorMessage.set(Array.isArray(message) ? message.join(', ') : (message ?? 'No se pudo crear la playlist.'));
        this.submitting.set(false);
      },
    });
  }
}
