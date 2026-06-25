import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectsService.findById(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
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
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    const project = await this.projectsService.findById(id);

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectsService.findById(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return this.projectsService.remove(id);
  }
}
