import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Song } from '../../songs/entities/song.entity';
import { Playlist } from './playlist.entity';

@Entity('playlist_items')
export class PlaylistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int', { default: 1 })
  position!: number;

  @ManyToOne(() => Song, { eager: true, nullable: false })
  song!: Song;

  @ManyToOne(() => Playlist, (playlist) => playlist.items, { onDelete: 'CASCADE' })
  playlist!: Playlist;
}
