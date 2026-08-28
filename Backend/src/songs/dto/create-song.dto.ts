import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  artist!: string;

  @IsString()
  @MinLength(1)
  album!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsString()
  @MinLength(1)
  slug!: string;

  @IsInt()
  @Min(1)
  durationSeconds!: number;

  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear!: number;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUUID()
  genreId!: string;
}
