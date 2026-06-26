import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({
    description: 'The title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    required: false,
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({
    description: 'The priority of the task',
    required: false,
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({
    description: 'The due date of the task',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
