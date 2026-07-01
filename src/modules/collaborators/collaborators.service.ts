import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CollaboratorRole } from '@prisma/client';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { PrismaService } from '../../prisma.service';
import { paginate, paginateOutput } from '../../utils/pagination.utils';
import {
  AddCollaboratorDto,
  CollaboratorListItemDto,
  UpdateCollaboratorDto,
} from './collaborators.dto';

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string, query?: QueryPaginationDto) {
    const collaborators = await this.prisma.projectCollaborator.findMany({
      ...paginate(query),
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const total = await this.prisma.projectCollaborator.count({
      where: {
        projectId,
      },
    });

    return paginateOutput<CollaboratorListItemDto>(collaborators, total, query);
  }

  async create(projectId: string, data: AddCollaboratorDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User specified not found');
    }

    return this.prisma.projectCollaborator.create({
      data: {
        userId: data.userId,
        role: data.role,
        projectId,
      },
      include: {
        user: {
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

  async update(projectId: string, userId: string, data: UpdateCollaboratorDto) {
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found in this project');
    }

    return this.prisma.projectCollaborator.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        role: data.role,
      },
      include: {
        user: {
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
  async remove(projectId: string, userId: string) {
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found in this project');
    }

    if (collaborator.role === CollaboratorRole.OWNER) {
      throw new BadRequestException('Cannot remove the owner of the project');
    }

    await this.prisma.projectCollaborator.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
  }
}
