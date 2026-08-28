import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsService } from './playlists.service';

type AuthRequest = { user: { id: string; roles: string[] } };

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @Auth(ValidRoles.user, ValidRoles.admin)
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req: AuthRequest) {
    return this.playlistsService.create(createPlaylistDto, req.user.id);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playlistsService.findAll(paginationDto);
  }

  @Get('mine')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findMine(@Query() paginationDto: PaginationDto, @Request() req: AuthRequest) {
    return this.playlistsService.findMine(req.user.id, paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  update(@Param('id') id: string, @Body() dto: UpdatePlaylistDto, @Request() req: AuthRequest) {
    return this.playlistsService.update(id, dto, req.user.id, req.user.roles);
  }

  @Delete(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.playlistsService.remove(id, req.user.id, req.user.roles);
  }
}
