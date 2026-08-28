import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'songCover' })
export class SongCoverPipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) return '/assets/images/covers/no-cover.svg';
    const normalized = value.trim().replace(/\\/g, '/');
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('/assets/')) {
      return normalized;
    }
    return `/assets/images/covers/${normalized}`;
  }
}
