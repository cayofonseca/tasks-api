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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ValidateResourcesId } from '../../common/decorators/validate-resources-id.decorator';
import { ValidateResourcesIdInterceptor } from '../../common/interceptors/validate-resources-id.interceptor';
import { CommentFullDto, CommentListItemDto, CommentRequestDto } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks/:taskId/comments',
})
@UseInterceptors(ValidateResourcesIdInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ValidateResourcesId()
  @ApiResponse({ type: [CommentListItemDto], description: 'Get all comments by task' })
  findAllByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentsService.findAllByTask(taskId);
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
