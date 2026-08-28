import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    async register(createUserDto: CreateUserDto) {

        const user = await this.usersService.create(createUserDto);

        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            ...user,
            token,
        };
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user =
            await this.usersService.findOneByEmailWithPassword(email);

        if (!user) {
            throw new UnauthorizedException(
                'Email o contraseña incorrectos',
            );
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!passwordIsValid) {
            throw new UnauthorizedException(
                'Email o contraseña incorrectos',
            );
        }

        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles,
            token,
        };
    }
}