import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      // Evitamos devolver el password
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
  const { limit = 10, offset = 0 } = paginationDto;

  return await this.userRepository.find({
    take: limit,
    skip: offset,
  });
}
async findOneById(id: string) {
  const user = await this.userRepository.findOneBy({ id });

  if (!user) {
    throw new NotFoundException(
      `Usuario con id ${id} no encontrado`,
    );
  }

  return user;
}

  async findOneByEmailWithPassword(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }


  private handleDBErrors(error: any): never {
    const driverError = error?.driverError as { errno?: number; sqlMessage?: string } | undefined;
    if (driverError?.errno === 1062) {
      throw new BadRequestException(driverError.sqlMessage ?? 'El correo ya está registrado');
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}