import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      const genre = this.genreRepository.create({
        ...createGenreDto,
        slug: createGenreDto.slug.toLowerCase().trim(),
      });
      return await this.genreRepository.save(genre);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [genres, count] = await this.genreRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
    });

    return { count, pages: Math.ceil(count / limit), genres };
  }

  async findOne(idSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idSlug);
    const genre = isUuid
      ? await this.genreRepository.findOneBy({ id: idSlug })
      : await this.genreRepository.findOneBy({ slug: idSlug.toLowerCase().trim() });

    if (!genre) {
      throw new NotFoundException(`Género con id o slug "${idSlug}" no encontrado`);
    }
    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    try {
      if (updateGenreDto.slug) {
        updateGenreDto.slug = updateGenreDto.slug.toLowerCase().trim();
      }
      this.genreRepository.merge(genre, updateGenreDto);
      return await this.genreRepository.save(genre);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);
    return { message: 'Género eliminado correctamente' };
  }

  private handleDBExceptions(error: unknown): never {
    if (error instanceof HttpException) throw error;
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { errno?: number; sqlMessage?: string };
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage ?? 'Ya existe un género con esos datos');
      }
    }
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
