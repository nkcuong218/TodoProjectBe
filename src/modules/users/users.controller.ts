import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  createNew(@Body() createUserDto: CreateUserDto) {
    return this.userService.createNew(createUserDto)
  }

  @Get()
  getAllUser() {
    return this.userService.getAllUser()
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getOneUserById(id)
  }

  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(id, updateUserDto)
  }

  @Patch('/delete/:id')
  softDeleteUserById(@Param('id') id: string) {
    return this.userService.softDeleteUserById(id)
  }
}
