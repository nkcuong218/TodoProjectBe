import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateTodoDto } from 'src/modules/todo/dto/update-todo.dto';

export class UpdateTodoByAdminDto extends PartialType(UpdateTodoDto) {
  @ApiPropertyOptional({ example: false, description: 'Soft delete status of the todo item' })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}