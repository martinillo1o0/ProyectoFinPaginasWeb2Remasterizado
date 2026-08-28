import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Song } from '@songs/interfaces/song.interface';
import { SongCoverPipe } from '@songs/pipes/song-cover.pipe';

@Component({
  selector: 'song-card',
  imports: [RouterLink, SongCoverPipe],
  templateUrl: './song-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongCard {
  song = input.required<Song>();

  durationLabel(): string {
    const seconds = this.song().durationSeconds;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }
}
