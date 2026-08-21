import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';

export class QueryUserDto {
  @ApiPropertyOptional({ example: 'john', description: 'Search query for user name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: Role, description: 'Filter by user role (admin or user)' })
  @IsOptional()
  @IsEnum(Role)
  role?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}