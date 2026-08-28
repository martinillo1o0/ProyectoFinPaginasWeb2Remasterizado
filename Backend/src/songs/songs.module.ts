import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { GenresModule } from '../genres/genres.module';
import { UsersModule } from '../users/users.module';
import { Song } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), UsersModule, GenresModule, AuthModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService, TypeOrmModule],
})
export class SongsModule {}
