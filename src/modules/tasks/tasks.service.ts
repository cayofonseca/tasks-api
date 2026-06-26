import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
    });
  }

  async create(projectId: string, data: TaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async update(projectId: string, taskId: string, data: TaskDto) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        projectId,
      },
      data,
    });
  }

  async delete(projectId: string, taskId: string) {
    await this.prisma.task.delete({
      where: {
        projectId,
        id: taskId,
      },
    });
  }
}
