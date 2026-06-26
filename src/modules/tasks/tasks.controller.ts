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
import { ValidateResourcesId } from '../../common/decorators/validate-resources-id.decorator';
import { ValidateResourcesIdInterceptor } from '../../common/interceptors/validate-resources-id.interceptor';
import { TaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
@UseInterceptors(ValidateResourcesIdInterceptor)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesId()
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Post()
  @ValidateResourcesId()
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskDto) {
    return this.taskService.create(projectId, data);
  }

  @Get(':taskId')
  @ValidateResourcesId()
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Put(':taskId')
  @ValidateResourcesId()
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: TaskDto
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
