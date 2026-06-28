import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as brcypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async signUp(data: SignUpDto) {
    const hash = await brcypt.hash(data.password, 12);

    const newUser = await this.usersService.create({
      ...data,
      password: hash,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async singIn(data: SignInDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user || !(await brcypt.compare(data.password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      acess_token: this.jwtService.sign(payload),
    };
  }
}
