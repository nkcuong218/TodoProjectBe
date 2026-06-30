import { Controller, UseGuards, Post, Req, Body, Get, Patch, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
// import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createNew(@Req() req, @Body() body: CreateTodoDto) {
    return this.todoService.createNew(body, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req) {
    return this.todoService.getAll(req.user.userId)
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch()
  // update(@Req() req, @Body() body: UpdateTodoDto) {
  //   return this.todoService.update(body, req.user.userId)
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('completed/:id')
  updateCompleted(@Req() req, @Param('id') id: string, @Body('isCompleted') isCompleted: boolean) {
    return this.todoService.updateCompleted(id, req.user.userId, isCompleted)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete/:id')
  deleteTodo(@Req() req, @Param('id') id: string) {
    return this.todoService.deleteTodo(id, req.user.userId)
  }
}
