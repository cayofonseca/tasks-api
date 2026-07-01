import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { RequestContextService } from '../../common/services/request-context.service';
import { PrismaService } from '../../prisma.service';
import { paginate, paginateOutput } from '../../utils/pagination.utils';
import { CommentListItemDto, CommentRequestDto } from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService
  ) {}

  async findAllByTask(taskId: string, query?: QueryPaginationDto) {
    const comments = await this.prisma.comment.findMany({
      ...paginate(query),
      where: {
        taskId,
      },
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
    });

    const total = await this.prisma.comment.count({
      where: {
        taskId,
      },
    });

    return paginateOutput<CommentListItemDto>(comments, total, query);
  }

  findById(taskId: string, commentId: string) {
    return this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    });
  }

  create(taskId: string, data: CommentRequestDto) {
    const userId = this.requestContext.getUserId();
    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        authorId: userId,
      },
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
    });
  }

  async update(taskId: string, commentId: string, data: CommentRequestDto) {
    const userId = this.requestContext.getUserId();
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data,
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
    });
  }

  async remove(taskId: string, commentId: string) {
    const userId = this.requestContext.getUserId();
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
