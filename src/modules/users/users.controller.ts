import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { QueryPaginationDto } from '../../common/dtos/query-pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { RequestContextService } from '../../common/services/request-context.service';
import { ApiPaginatedResponse } from '../../common/swagger/api-paginated-response';
import { CreateUserDto, UpdateUserDto, UserFullDto, UserListItemDto } from './users.dto';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestContext: RequestContextService
  ) {}

  @Get()
  @ApiPaginatedResponse(UserListItemDto)
  findAll(@Query() query?: QueryPaginationDto) {
    return this.userService.findAll(query);
  }

  @ApiResponse({ type: UserFullDto })
  @Get(':userId')
  async findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Put(':userId')
  async update(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateUserDto) {
    return this.userService.update(userId, data);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.delete(userId);
  }

  @Post('/avatar')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User avatar uploaded successfully',
    type: UserListItemDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const user = this.requestContext.getUser();

    const response = await this.cloudinaryService.upload(file, user.id);

    await this.userService.update(user.id, {
      ...user,
      avatar: response.url,
    });

    return this.userService.findById(user.id);
  }
}
