import { Module } from '@nestjs/common';
import { RequestContextService } from '../../common/services/request-context.service';
import { PrismaService } from '../../prisma.service';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

@Module({
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, PrismaService, RequestContextService],
})
export class CollaboratorsModule {}
