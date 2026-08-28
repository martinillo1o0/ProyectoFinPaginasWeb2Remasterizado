import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { SongCard } from '@songs/components/song-card/song-card';
import { SongsService } from '@songs/services/songs.service';

@Component({
  selector: 'app-home-page',
  imports: [SongCard],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly songsService = inject(SongsService);
  readonly pageSize = 100;
  readonly page = signal(1);
  readonly songResource = rxResource({
    params: () => ({ page: this.page() }),
    stream: ({ params }) => this.songsService.getSongs(this.pageSize, (params.page - 1) * this.pageSize),
  });

  readonly featuredSongs = computed(() => (this.songResource.value()?.songs ?? []).slice(0, 4));

  nextPage(): void {
    if (this.page() < (this.songResource.value()?.pages ?? 1)) this.page.update((value) => value + 1);
  }

  previousPage(): void {
    if (this.page() > 1) this.page.update((value) => value - 1);
  }
}
