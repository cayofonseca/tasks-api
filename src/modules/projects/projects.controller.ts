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
import { ApiResponse } from '@nestjs/swagger';
import { ProjectListItemDto, ProjectRequestDto } from './projects.dto';
import { ProjectsService } from './projects.service';

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  @ApiResponse({
    type: [ProjectListItemDto],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: ProjectListItemDto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDto,
  })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data);
  }

  @Put(':id')
  @ApiResponse({
    type: ProjectListItemDto,
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
