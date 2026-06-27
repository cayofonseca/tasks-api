import { Injectable } from '@nestjs/common';
import { CollaboratorRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { ProjectRequestDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}
  findAll() {
    return this.prismaService.project.findMany();
  }

  findById(id: string) {
    return this.prismaService.project.findFirst({
      where: {
        id,
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
    const project = await this.prismaService.project.create({
      data: {
        ...data,
        createdById: 'd478d571-479a-447d-a76a-45f3c7c07124',
      },
    });

    // add the user as owner to the created project
    await this.prismaService.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: 'd478d571-479a-447d-a76a-45f3c7c07124',
        role: CollaboratorRole.OWNER,
      },
    });

    return project;
  }

  update(id: string, data: ProjectRequestDto) {
    return this.prismaService.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    await this.prismaService.task.deleteMany({
      where: {
        projectId: id,
      },
    });
    return this.prismaService.project.delete({
      where: {
        id,
      },
    });
  }
}
