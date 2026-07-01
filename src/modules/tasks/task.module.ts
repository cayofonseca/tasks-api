import { Module } from '@nestjs/common';
import { RequestContextService } from '../../common/services/request-context.service';
import { PrismaService } from '../../prisma.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RequestContextService],
})
export class TasksModule {}
