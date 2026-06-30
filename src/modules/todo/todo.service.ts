import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
  ) { }

  async createNew(body: CreateTodoDto, userId: string) {
    const todo = this.todoModel.create({
      content: body.content,
      isCompleted: false,
      userId: userId,
      isDeleted: false
    })
    return todo;
  }

  async getAll(userId: string) {
    return this.todoModel.find({ userId: userId, isDeleted: false })
  }

  // async update(userId: string, UpdateTodoDto: UpdateTodoDto) {
  //   await this.todoModel.fin
  // }

  async updateCompleted(id: string, userId: string, isCompleted: boolean) {
    return this.todoModel.findOneAndUpdate({
      userId: userId,
      _id: id
    }, {
      isCompleted,
    }, { new: true })
  }

  async deleteTodo(id: string, userId: string) {
    return this.todoModel.findOneAndUpdate({
      userId: userId,
      _id: id
    }, {
      isDeleted: true
    }, { new: true })
  }
}
