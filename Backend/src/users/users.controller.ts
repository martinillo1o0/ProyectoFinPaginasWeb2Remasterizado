import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PaginationDto } from '../common/dto/pagination.dto';
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

@Get()
@Auth(ValidRoles.admin)
findAll(
  @Query() paginationDto: PaginationDto,
) {
  return this.usersService.findAll(paginationDto);
}
}