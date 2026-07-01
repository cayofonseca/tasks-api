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
import {
  AddCollaboratorDto,
  CollaboratorListItemDto,
  UpdateCollaboratorDto,
} from './collaborators.dto';
import { CollaboratorsService } from './collaborators.service';

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators',
})
@UseInterceptors(ValidateResourcesIdInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  @ValidateResourcesId()
  @ApiPaginatedResponse(CollaboratorListItemDto)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDto
  ) {
    return this.collaboratorsService.findAllByProject(projectId, query);
  }

  @Post()
  @ValidateResourcesId()
  @ApiCreatedResponse({
    type: CollaboratorListItemDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: AddCollaboratorDto, @Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.collaboratorsService.create(projectId, data);
  }

  @Put(':userId')
  @ValidateResourcesId()
  @ApiOkResponse({
    type: CollaboratorListItemDto,
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDto
  ) {
    return this.collaboratorsService.update(projectId, userId, data);
  }

  @Delete(':userId')
  @ValidateResourcesId()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return this.collaboratorsService.remove(projectId, userId);
  }
}
