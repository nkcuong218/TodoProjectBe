import { Controller, UseGuards, Post, Req, Body, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoCompletedDto } from './dto/update-completed-todo.dto';

@ApiTags('Todo')
@ApiBearerAuth('JWT-auth')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new todo item' })
  @ApiResponse({ status: 201, description: 'Todo item created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createNew(@Req() req, @Body() body: CreateTodoDto) {
    return this.todoService.createNew(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all todo items for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of todo items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Req() req) {
    return this.todoService.getAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('completed/:id')
  @ApiOperation({ summary: 'Update completed status of a todo item' })
  @ApiParam({ name: 'id', description: 'Todo item ID' })
  @ApiBody({ type: UpdateTodoCompletedDto })
  @ApiResponse({ status: 200, description: 'Todo completed status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  updateCompleted(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateTodoCompletedDto,
  ) {
    return this.todoService.updateCompleted(id, req.user.userId, body.isCompleted);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete/:id')
  @ApiOperation({ summary: 'Soft delete a todo item' })
  @ApiParam({ name: 'id', description: 'Todo item ID' })
  @ApiResponse({ status: 200, description: 'Todo item soft deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  deleteTodo(@Req() req, @Param('id') id: string) {
    return this.todoService.deleteTodo(id, req.user.userId);
  }
}
