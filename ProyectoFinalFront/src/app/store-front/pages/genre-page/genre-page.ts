import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { SongCard } from '@songs/components/song-card/song-card';
import { SongsService } from '@songs/services/songs.service';

const validGenres = ['pop', 'rock', 'hip-hop', 'electronica', 'regional-mexicano'] as const;

@Component({
  selector: 'app-genre-page',
  imports: [SongCard, RouterLink],
  templateUrl: './genre-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenrePage {
  private readonly route = inject(ActivatedRoute);
  private readonly songsService = inject(SongsService);
  readonly genre = toSignal(this.route.paramMap.pipe(map((params) => params.get('genre'))), { initialValue: null });
  readonly validGenre = computed(() => validGenres.includes(this.genre() as typeof validGenres[number]));
  readonly songResource = rxResource({
    params: () => ({ genre: this.genre() }),
    stream: ({ params }) => this.songsService.getSongs(100, 0, params.genre ?? undefined),
  });
}
