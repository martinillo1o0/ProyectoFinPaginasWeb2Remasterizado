import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { CreateSongDto } from './dto/create-song.dto';
import { FindSongsDto } from './dto/find-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createSongDto: CreateSongDto, @Request() req: { user: { id: string } }) {
    return this.songsService.create(createSongDto, req.user.id);
  }

  @Get()
  findAll(@Query() findSongsDto: FindSongsDto) {
    return this.songsService.findAll(findSongsDto);
  }

  @Get(':idSlug')
  findOne(@Param('idSlug') idSlug: string) {
    return this.songsService.findOne(idSlug);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }
}
