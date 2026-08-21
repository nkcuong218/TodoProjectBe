import { Controller, UseGuards, Get, Param, Body, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserByAdminDto } from './dto/update-user.dto';
import { UpdateTodoByAdminDto } from './dto/update-todo.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Admin: Find all users with search & pagination' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  findAllUsers(@Query() query: QueryUserDto) {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Admin: Find user details by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Patch('users/update/:id')
  @ApiOperation({ summary: 'Admin: Update user information or role' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUserByAdmin(@Param('id') id: string, @Body() updateUserByAdmin: UpdateUserByAdminDto) {
    return this.adminService.updateUserByAdmin(id, updateUserByAdmin);
  }

  @Patch('users/delete/:id')
  @ApiOperation({ summary: 'Admin: Soft delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  softDeleteUserByAdmin(@Param('id') id: string) {
    return this.adminService.softDeleteUserByAdmin(id);
  }

  @Patch('users/restore/:id')
  @ApiOperation({ summary: 'Admin: Restore soft-deleted user by ID' })
  @ApiParam({ name: 'id', description: 'User ID string' })
  @ApiResponse({ status: 200, description: 'User restored successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  restoreUserByAdmin(@Param('id') id: string) {
    return this.adminService.restoreUserByAdmin(id);
  }

  // Todo Management
  @Get('todos')
  @ApiOperation({ summary: 'Admin: Find all todos with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated todo list' })
  findAllTodos(@Query() query: PaginationQueryDto) {
    return this.adminService.findAllTodo(query);
  }

  @Get('todos/:id')
  @ApiOperation({ summary: 'Admin: Find todo details by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID string' })
  @ApiResponse({ status: 200, description: 'Todo details' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findTodoById(@Param('id') id: string) {
    return this.adminService.findTodoById(id);
  }

  @Patch('todos/update/:id')
  @ApiOperation({ summary: 'Admin: Update todo item by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID string' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  updateTodoByAdmin(@Param('id') id: string, @Body() updateTodoByAdmin: UpdateTodoByAdminDto) {
    return this.adminService.updateTodoByAdmin(id, updateTodoByAdmin);
  }

  @Patch('todos/delete/:id')
  @ApiOperation({ summary: 'Admin: Soft delete todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID string' })
  @ApiResponse({ status: 200, description: 'Todo soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  softDeleteTodoByAdmin(@Param('id') id: string) {
    return this.adminService.softDeleteTodoByAdmin(id);
  }

  @Patch('todos/restore/:id')
  @ApiOperation({ summary: 'Admin: Restore soft-deleted todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID string' })
  @ApiResponse({ status: 200, description: 'Todo restored successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  restoreTodoByAdmin(@Param('id') id: string) {
    return this.adminService.restoreTodoByAdmin(id);
  }

  // Dashboard
  @Get('dashboard')
  @ApiOperation({ summary: 'Admin: Get dashboard system statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics and overview' })
  getDashboard() {
    return this.adminService.getDashboard();
  }
}
