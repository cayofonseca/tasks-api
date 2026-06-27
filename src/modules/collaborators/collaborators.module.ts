import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

@Module({
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, PrismaService],
})
export class CollaboratorsModule {}
