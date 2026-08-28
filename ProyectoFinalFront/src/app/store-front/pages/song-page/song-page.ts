import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { PlaylistService } from '@playlist/services/playlist.service';
import { SongCoverPipe } from '@songs/pipes/song-cover.pipe';
import { SongsService } from '@songs/services/songs.service';

@Component({
  selector: 'app-song-page',
  imports: [SongCoverPipe],
  templateUrl: './song-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongPage {
  private readonly route = inject(ActivatedRoute);
  private readonly songsService = inject(SongsService);
  readonly playlist = inject(PlaylistService);
  readonly songIdSlug = toSignal(this.route.paramMap.pipe(map((params) => params.get('idSlug') ?? '')), { initialValue: '' });
  readonly added = signal(false);

  readonly songResource = rxResource({
    params: () => ({ idSlug: this.songIdSlug() }),
    stream: ({ params }) => this.songsService.getSongByIdSlug(params.idSlug),
  });

  durationLabel(): string {
    const seconds = this.songResource.value()?.durationSeconds ?? 0;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  addToPlaylist(): void {
    const song = this.songResource.value();
    if (!song) return;
    this.playlist.add(song);
    this.added.set(true);
  }
}
