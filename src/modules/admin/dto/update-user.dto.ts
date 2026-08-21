import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserByAdminDto extends PartialType(UpdateUserDto) {
  @ApiPropertyOptional({ enum: Role, description: 'Role assigned to the user' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: false, description: 'Soft delete status of the user' })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}