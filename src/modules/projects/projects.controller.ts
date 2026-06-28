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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ValidateResourcesId } from '../../common/decorators/validate-resources-id.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ValidateResourcesIdInterceptor } from '../../common/interceptors/validate-resources-id.interceptor';
import { ProjectFullDto, ProjectListItemDto, ProjectRequestDto } from './projects.dto';
import { ProjectsService } from './projects.service';

@Controller({
  version: '1',
  path: 'projects',
})
@UseInterceptors(ValidateResourcesIdInterceptor)

@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  @ApiResponse({
    type: [ProjectListItemDto],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':projectId')
  @ApiResponse({
    type: ProjectFullDto,
  })
  @ValidateResourcesId()
  async findOne(@Param('projectId', ParseUUIDPipe) id: string) {
    return await this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDto,
  })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data);
  }

  @Put(':projectId')
  @ApiResponse({
    type: ProjectListItemDto,
  })
  @ValidateResourcesId()
  async update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    return this.projectsService.update(id, data);
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesId()
  async remove(@Param('projectId', ParseUUIDPipe) id: string) {
    return await this.projectsService.remove(id);
  }
}
