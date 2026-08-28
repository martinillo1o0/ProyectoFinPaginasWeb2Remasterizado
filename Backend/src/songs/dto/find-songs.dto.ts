import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindSongsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  genre?: string;
}
