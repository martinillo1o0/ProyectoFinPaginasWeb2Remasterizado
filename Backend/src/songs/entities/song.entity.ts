import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Genre } from '../../genres/entities/genre.entity';
import { User } from '../../users/entities/user.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 180 })
  title!: string;

  @Column('varchar', { length: 180 })
  artist!: string;

  @Column('varchar', { length: 180 })
  album!: string;

  @Column('text')
  description!: string;

  @Column('varchar', { length: 220, unique: true })
  slug!: string;

  @Column('int')
  durationSeconds!: number;

  @Column('int')
  releaseYear!: number;

  @Column('varchar', { length: 255, nullable: true })
  coverUrl?: string;

  @Column('json', { default: () => "('[]')" })
  tags!: string[];

  @ManyToOne(() => Genre, { eager: true, nullable: false })
  genre!: Genre;

  @ManyToOne(() => User, { eager: true, nullable: false })
  user!: User;
}
