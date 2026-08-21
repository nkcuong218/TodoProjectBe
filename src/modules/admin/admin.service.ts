import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TodoService } from '../todo/todo.service';
import { UpdateUserByAdminDto } from './dto/update-user.dto';
import { UpdateTodoByAdminDto } from './dto/update-todo.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService, private readonly todoService: TodoService) { }

  async findAllUsers(query: QueryUserDto) {
    return this.usersService.getAllUser(query);
  }

  async findUserById(id: string) {
    return this.usersService.getOneUserById(id);
  }

  async updateUserByAdmin(id: string, data: UpdateUserByAdminDto) {
    return this.usersService.updateUserById(id, data);
  }

  async softDeleteUserByAdmin(id: string) {
    return this.usersService.softDeleteUserById(id)
  }

  async restoreUserByAdmin(id: string) {
    return this.usersService.restoreUserById(id)
  }

  //todo

  async findAllTodo(query: PaginationQueryDto) {
    return this.todoService.AdminFindAll(query)
  }

  async findTodoById(id: string) {
    return this.todoService.getTodoById(id)
  }

  async updateTodoByAdmin(id: string, updateTodoByAdminDto: UpdateTodoByAdminDto) {
    return this.todoService.updateTodoByAdmin(id, updateTodoByAdminDto)
  }

  async softDeleteTodoByAdmin(id: string) {
    return this.todoService.softDeleteTodoByAdmin(id)
  }

  async restoreTodoByAdmin(id: string) {
    return this.todoService.restoreTodoByAdmin(id)
  }


  //dashboard

  async getDashboard() {
    const totalUsers = await this.usersService.getTotalUsers();
    const userUsers = await this.usersService.getUserUser();
    const totalTodo = await this.todoService.getTotalTodo();
    const completedTodo = await this.todoService.getCompletedTodo();

    const recentUsers = await this.usersService.getRecentUsers();
    const recentTodos = await this.todoService.getRecentTodos();

    return {
      totalUsers,
      userUsers,
      totalTodo,
      completedTodo,
      recentUsers,
      recentTodos
    }
  }
}
