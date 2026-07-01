import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { PrismaService } from '../../prisma.service';
import { paginate, paginateOutput } from '../../utils/pagination.utils';
import { CreateUserDto, UpdateUserDto, UserListItemDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: QueryPaginationDto) {
    const users = await this.prisma.user.findMany({
      ...paginate(query),
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.user.count();

    return paginateOutput<UserListItemDto>(users, total, query);
  }

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        createdProjects: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
