import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskRequestDto {
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

  @ApiProperty({ description: 'Assignee User Id', required: true })
  @IsString()
  @IsOptional()
  assineeId?: string;
}

class TaskBaseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty({ nullable: true, required: false }) description?: string | null;
  @ApiProperty({ enum: TaskStatus }) status: TaskStatus;
  @ApiProperty({ enum: TaskPriority }) priority: TaskPriority;
  @ApiProperty({ nullable: true, required: false, format: 'date-time' }) dueDate?: Date | null;
  @ApiProperty({ format: 'date-time' }) createdAt: Date;
  @ApiProperty({ format: 'date-time' }) updatedAt: Date;
}

export class TaskAssigneeDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true, required: false }) avatar?: string | null;
}

export class TaskListItemDto extends TaskBaseDto {
  @ApiProperty({ type: TaskAssigneeDto, nullable: true, required: false })
  assignee?: TaskAssigneeDto | null;
}

export class TaskCommentUserDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true, required: false }) avatar?: string | null;
}

export class TaskCommentDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty({ format: 'date-time' }) createdAt: Date;
  @ApiProperty({ type: TaskCommentUserDto }) user: TaskCommentUserDto;
}

export class TaskFullDto {
  @ApiProperty({ type: TaskAssigneeDto, nullable: true, required: false })
  assignee?: TaskAssigneeDto | null;

  @ApiProperty({ type: [TaskCommentDto] })
  comments: TaskCommentDto;
}
