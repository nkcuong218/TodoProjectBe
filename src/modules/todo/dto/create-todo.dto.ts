import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries', description: 'Content of the todo item' })
  @IsString()
  @IsNotEmpty()
  content: string;

  // @ApiProperty({ example: '60d5ecb8b5c9c22b1c8e4567', description: 'ID of the user who owns this todo' })
  // @IsString()
  // @IsNotEmpty()
  // userId: string;
}
