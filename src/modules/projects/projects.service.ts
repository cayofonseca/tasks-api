import { Injectable } from '@nestjs/common';
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

  create(userId: string, data: ProjectRequestDto) {
    return this.prismaService.project.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
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
