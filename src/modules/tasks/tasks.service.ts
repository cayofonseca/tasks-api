import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { PrismaService } from '../../prisma.service';
import { paginate, paginateOutput } from '../../utils/pagination.utils';
import { TaskListItemDto, TaskRequestDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string, query?: QueryPaginationDto) {
    const tasks = await this.prisma.task.findMany({
      ...paginate(query),
      where: {
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        dueDate: true,
        status: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.task.count({
      where: {
        projectId,
      },
    });

    return paginateOutput<TaskListItemDto>(tasks, total, query);
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async create(projectId: string, data: TaskRequestDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(projectId: string, taskId: string, data: TaskRequestDto) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        projectId,
      },
      data,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
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
