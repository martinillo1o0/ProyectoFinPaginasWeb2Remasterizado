import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { PlaylistItem } from './playlist-item.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 160 })
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('bool', { default: false })
  isPublic!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { eager: true, nullable: false })
  user!: User;

  @OneToMany(() => PlaylistItem, (item) => item.playlist, { cascade: true, eager: true })
  items!: PlaylistItem[];
}
