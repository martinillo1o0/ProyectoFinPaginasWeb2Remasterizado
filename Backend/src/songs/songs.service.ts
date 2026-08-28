import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { GenresService } from '../genres/genres.service';
import { UsersService } from '../users/users.service';
import { CreateSongDto } from './dto/create-song.dto';
import { FindSongsDto } from './dto/find-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly usersService: UsersService,
    private readonly genresService: GenresService,
  ) {}

  async create(createSongDto: CreateSongDto, userId: string) {
    try {
      const { genreId, ...songData } = createSongDto;
      const [user, genre] = await Promise.all([
        this.usersService.findOneById(userId),
        this.genresService.findOne(genreId),
      ]);

      const song = this.songRepository.create({
        ...songData,
        slug: songData.slug.toLowerCase().trim(),
        tags: songData.tags ?? [],
        user,
        genre,
      });

      return await this.songRepository.save(song);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(findSongsDto: FindSongsDto) {
    const { limit = 10, offset = 0, genre } = findSongsDto;
    const query = this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.genre', 'genre')
      .leftJoinAndSelect('song.user', 'user')
      .orderBy('song.title', 'ASC')
      .take(limit)
      .skip(offset);

    if (genre) {
      query.andWhere('genre.slug = :genre', { genre: genre.toLowerCase().trim() });
    }

    const [songs, count] = await query.getManyAndCount();
    return { count, pages: Math.ceil(count / limit), songs };
  }

  async findOne(idSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idSlug);
    const song = isUuid
      ? await this.songRepository.findOneBy({ id: idSlug })
      : await this.songRepository.findOneBy({ slug: idSlug.toLowerCase().trim() });

    if (!song) {
      throw new NotFoundException(`Canción con id o slug "${idSlug}" no encontrada`);
    }
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.findOne(id);
    try {
      const { genreId, ...songData } = updateSongDto;
      if (songData.slug) songData.slug = songData.slug.toLowerCase().trim();
      this.songRepository.merge(song, songData);
      if (genreId) song.genre = await this.genresService.findOne(genreId);
      return await this.songRepository.save(song);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
    return { message: 'Canción eliminada correctamente' };
  }

  private handleDBExceptions(error: unknown): never {
    if (error instanceof HttpException) throw error;
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { errno?: number; sqlMessage?: string };
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage ?? 'Ya existe una canción con esos datos');
      }
    }
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
