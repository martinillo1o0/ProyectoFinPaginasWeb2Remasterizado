import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    select: false,
  })
  password: string;

  @Column('varchar', {
    length: 255,
  })
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('json', {
    default: () => "('[\"user\"]')",
  })
  roles: string[];
}