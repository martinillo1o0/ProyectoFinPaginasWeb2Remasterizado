import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePlaylistDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
