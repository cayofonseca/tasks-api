import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ValidateResourcesId } from '../../common/decorators/validate-resources-id.decorator';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ValidateResourcesIdInterceptor } from '../../common/interceptors/validate-resources-id.interceptor';
import { ApiPaginatedResponse } from '../../common/swagger/api-paginated-response';
import { CommentFullDto, CommentListItemDto, CommentRequestDto } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks/:taskId/comments',
})
@UseInterceptors(ValidateResourcesIdInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ValidateResourcesId()
  @ApiPaginatedResponse(CommentListItemDto)
  findAllByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Query() query?: QueryPaginationDto
  ) {
    return this.commentsService.findAllByTask(taskId, query);
  }

  @Get(':commentId')
  @ValidateResourcesId()
  @ApiOkResponse({ type: CommentFullDto, description: 'Get comment by Id' })
  findOne(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string
  ) {
    return this.commentsService.findById(taskId, commentId);
  }

  @Post()
  @ValidateResourcesId()
  @ApiCreatedResponse({ type: CommentListItemDto, description: 'Create a new comment' })
  @HttpCode(HttpStatus.CREATED)
  create(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() data: CommentRequestDto) {
    return this.commentsService.create(taskId, data);
  }

  @Put(':commentId')
  @ValidateResourcesId()
  @ApiOkResponse({ type: CommentListItemDto, description: 'Update a comment' })
  update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId') commentId: string,
    @Body() data: CommentRequestDto
  ) {
    return this.commentsService.update(taskId, commentId, data);
  }

  @Delete(':commentId')
  @ApiNoContentResponse({ description: 'Delete a comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string
  ) {
    return this.commentsService.remove(taskId, commentId);
  }
}
