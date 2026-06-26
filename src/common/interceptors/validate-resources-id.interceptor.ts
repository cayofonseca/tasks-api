import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { VALIDATE_RESOURCES_IDS_KEY } from '../../consts';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ValidateResourcesIdInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    const shouldValidate = this.reflector.get<boolean>(
      VALIDATE_RESOURCES_IDS_KEY,
      context.getHandler()
    );

    if (!shouldValidate) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const projectId = request.params.projectId;

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const taskId = request.params.taskId;
    if (taskId) {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          projectId,
        },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }
    }

    return next.handle();
  }
}
