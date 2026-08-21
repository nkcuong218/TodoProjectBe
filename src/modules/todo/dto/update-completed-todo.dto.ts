import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoCompletedDto {
  @ApiProperty({ example: true, description: 'Completion status of the todo item' })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
