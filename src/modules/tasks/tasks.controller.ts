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
} from '@nestjs/common';
import { TaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Post()
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskDto) {
    return this.taskService.create(projectId, data);
  }

  @Get(':taskId')
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Put(':taskId')
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
