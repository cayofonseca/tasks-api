import { IsNumberString, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  size?: string;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    totalPerPage: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}
