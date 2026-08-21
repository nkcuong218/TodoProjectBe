import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password (minimum 6 characters)', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}