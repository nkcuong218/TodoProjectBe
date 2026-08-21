import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileAdminDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A Updated', description: 'Updated full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'updated@example.com', description: 'Updated email address' })
  @IsOptional()
  @IsEmail()
  email?: string;
}