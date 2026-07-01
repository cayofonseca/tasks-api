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
import { TaskFullDto, TaskListItemDto, TaskRequestDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
@UseInterceptors(ValidateResourcesIdInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesId()
  @ApiPaginatedResponse(TaskListItemDto)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDto
  ) {
    return this.taskService.findAllByProject(projectId, query);
  }

  @Post()
  @ValidateResourcesId()
  @ApiCreatedResponse({ type: TaskListItemDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskRequestDto) {
    return this.taskService.create(projectId, data);
  }

  @Get(':taskId')
  @ValidateResourcesId()
  @ApiOkResponse({ type: TaskFullDto })
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Put(':taskId')
  @ValidateResourcesId()
  @ApiOkResponse({ type: TaskListItemDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: TaskRequestDto
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Task deleted successfully' })
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
