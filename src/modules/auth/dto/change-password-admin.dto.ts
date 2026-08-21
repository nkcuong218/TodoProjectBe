import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Current user password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword456', description: 'New password' })
  @IsString()
  newPassword: string;
}