import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.ADMIN, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.ADMIN;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User role', required: false, default: Role.ADMIN })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  avatar?: string;
}

export class UserListItemDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updateAt: string;
}

class UserProjectDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true, required: false }) description: string;
}

export class UserFullDto extends UserListItemDto {
  @ApiProperty({ type: [UserProjectDto] })
  createdProjects: UserProjectDto[];
}
