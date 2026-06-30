import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as brcypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: 'password-reset',
    });

    await this.mailService.sendPasswordRequest(email, token);

    return {
      message: 'Password request email sent ',
    };
  }

  async resetPassword(token: string, password: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.purpose !== 'password-reset') {
        throw new BadRequestException('Invalid token');
      }

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      const hash = await brcypt.hash(password, 12);

      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
