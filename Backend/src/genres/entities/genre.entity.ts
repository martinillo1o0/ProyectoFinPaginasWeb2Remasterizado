import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 120, unique: true })
  name!: string;

  @Column('varchar', { length: 160, unique: true })
  slug!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('bool', { default: true })
  isActive!: boolean;
}
