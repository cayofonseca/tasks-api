import { Injectable } from '@nestjs/common';
import { CollaboratorRole } from '@prisma/client';
import { RequestContextService } from '../../common/services/request-context.service';
import { PrismaService } from '../../prisma.service';
import { ProjectRequestDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly requestContext: RequestContextService
  ) {}
  findAll() {
    const userId = this.requestContext.getUserId();

    return this.prismaService.project.findMany({
      where: {
        createdById: userId,
      },
    });
  }

  findById(id: string) {
    const userId = this.requestContext.getUserId();
    return this.prismaService.project.findFirst({
      where: {
        id,
        createdById: userId,
      },
      select: {
        id: true,
        name: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async create(data: ProjectRequestDto) {
    const userId = this.requestContext.getUserId();

    const project = await this.prismaService.project.create({
      data: {
        ...data,
        createdById: userId,
      },
    });

    await this.prismaService.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: CollaboratorRole.OWNER,
      },
    });

    return project;
  }

  update(id: string, data: ProjectRequestDto) {
    const userId = this.requestContext.getUserId();
    return this.prismaService.project.update({
      where: {
        id,
        createdById: userId,
      },
      data,
    });
  }

  async remove(id: string) {
    const userId = this.requestContext.getUserId();
    await this.prismaService.task.deleteMany({
      where: {
        projectId: id,
      },
    });
    return this.prismaService.project.delete({
      where: {
        id,
        createdById: userId,
      },
    });
  }
}
