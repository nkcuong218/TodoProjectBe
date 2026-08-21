import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginationQueryDto } from '../admin/dto/pagination-query.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createNew(@Body() createUserDto: CreateUserDto) {
    return this.userService.createNew(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'Admin test endpoint' })
  @ApiResponse({ status: 200, description: 'Welcome Admin message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  adminOnly() {
    return {
      message: 'Welcome Admin',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  getAllUser(@Query() query: PaginationQueryDto) {
    return this.userService.getAllUser(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id') id: string) {
    return this.userService.getOneUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @Patch('/delete/:id')
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  softDeleteUserById(@Param('id') id: string) {
    return this.userService.softDeleteUserById(id);
  }
}
