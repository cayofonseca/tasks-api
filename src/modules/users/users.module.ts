import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { RequestContextService } from '../../common/services/request-context.service';
import { PrismaService } from '../../prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CloudinaryService, RequestContextService],
})
export class UsersModule {}
