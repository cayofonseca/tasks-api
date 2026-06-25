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
    });
  }

  create(data: ProjectRequestDto) {
    return this.prismaService.project.create({
      data,
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

  remove(id: string) {
    return this.prismaService.project.delete({
      where: {
        id,
      },
    });
  }
}
