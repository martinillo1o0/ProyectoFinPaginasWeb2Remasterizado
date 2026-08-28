import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SongsService } from '../songs/songs.service';
import { UsersService } from '../users/users.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistItem)
    private readonly playlistItemRepository: Repository<PlaylistItem>,
    private readonly usersService: UsersService,
    private readonly songsService: SongsService,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: string) {
    try {
      const user = await this.usersService.findOneById(userId);
      const songs = await Promise.all(createPlaylistDto.songIds.map((songId) => this.songsService.findOne(songId)));
      const items = songs.map((song, index) => this.playlistItemRepository.create({ song, position: index + 1 }));
      const playlist = this.playlistRepository.create({
        name: createPlaylistDto.name,
        description: createPlaylistDto.description,
        isPublic: createPlaylistDto.isPublic ?? false,
        user,
        items,
      });
      return await this.playlistRepository.save(playlist);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [playlists, count] = await this.playlistRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return { count, pages: Math.ceil(count / limit), playlists };
  }

  async findMine(userId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [playlists, count] = await this.playlistRepository.findAndCount({
      where: { user: { id: userId } },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return { count, pages: Math.ceil(count / limit), playlists };
  }

  async findOne(id: string) {
    const playlist = await this.playlistRepository.findOneBy({ id });
    if (!playlist) throw new NotFoundException(`Playlist con id ${id} no encontrada`);
    return playlist;
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto, userId: string, roles: string[]) {
    const playlist = await this.findOne(id);
    if (playlist.user.id !== userId && !roles.includes('admin')) {
      throw new ForbiddenException('No puedes modificar esta playlist');
    }
    try {
      this.playlistRepository.merge(playlist, updatePlaylistDto);
      return await this.playlistRepository.save(playlist);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, userId: string, roles: string[]) {
    const playlist = await this.findOne(id);
    if (playlist.user.id !== userId && !roles.includes('admin')) {
      throw new ForbiddenException('No puedes eliminar esta playlist');
    }
    await this.playlistRepository.remove(playlist);
    return { message: 'Playlist eliminada correctamente' };
  }

  private handleDBExceptions(error: unknown): never {
    if (error instanceof HttpException) throw error;
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { errno?: number; sqlMessage?: string };
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage ?? 'Datos duplicados');
      }
    }
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
