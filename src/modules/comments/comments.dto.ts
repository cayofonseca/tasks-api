import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentRequestDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

class CommentAuthorDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  avatar: string | null;
}

export class CommentListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ type: CommentAuthorDto })
  author: CommentAuthorDto;
}

class CommentTaskDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  projectId: string;
}

export class CommentFullDto extends CommentListItemDto {
  @ApiProperty({ type: CommentTaskDto })
  task: CommentTaskDto;
}
