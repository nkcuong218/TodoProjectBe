import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTodoByAdminDto } from '../admin/dto/update-todo.dto';
import { PaginationQueryDto } from '../admin/dto/pagination-query.dto';
import { RedisService } from '../redis/redis.service';
import { RedisKey } from 'src/common/redis/redis-key.helper';


@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
    private readonly redisService: RedisService
  ) { }

  async createNew(body: CreateTodoDto, userId: string) {
    const todo = await this.todoModel.create({
      content: body.content,
      isCompleted: false,
      userId: new Types.ObjectId(userId),
      isDeleted: false
    })

    await this.redisService.del(RedisKey.todoByUser(userId));
    return todo;
  }

  // async getAll(userId: string) {
  //   return this.todoModel.find({ userId: userId, isDeleted: false })
  // }
  async getAll(userId: string) {

    const cacheKey = RedisKey.todoByUser(userId);
    //1. Kiem tra chache
    const cacheTodos = await this.redisService.get<Todo[]>(cacheKey);

    //2. co thi lay tu cache ra
    if (cacheTodos) {
      console.log('data from redis');
      return cacheTodos;
    }

    //3. khong co thi lay tu db
    const todos = await this.todoModel.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false
    }).lean();

    //4. Luu cache
    await this.redisService.set(cacheKey, todos, 300);

    console.log('data from db');
    return todos
  }

  async getTodoById(id: string) {
    const cacheKey = RedisKey.todoDetail(id);
    const cacheDetailTodo = await this.redisService.get(cacheKey);
    if (cacheDetailTodo) {
      console.log('data from redis');
      return cacheDetailTodo;
    }

    const todo = await this.todoModel
      .findById(id)
      .populate('userId', 'name email')
      .lean();

    if (!todo) {
      return null;
    }
    console.log('data from db');
    await this.redisService.set(cacheKey, todo, 300);
    return todo;
  }

  // async update(userId: string, UpdateTodoDto: UpdateTodoDto) {
  //   await this.todoModel.fin
  // }

  async updateCompleted(id: string, userId: string, isCompleted: boolean) {
    const todo = await this.todoModel.findOneAndUpdate({
      userId: new Types.ObjectId(userId),
      _id: id
    }, {
      isCompleted,
    }, { new: true }).lean();

    if (!todo) {
      return null;
    }
    await this.redisService.del(RedisKey.todoByUser(userId));
    await this.redisService.del(RedisKey.todoDetail(id));
    return todo
  }

  async deleteTodo(id: string, userId: string) {
    const todo = await this.todoModel.findOneAndUpdate({
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(id)
    }, {
      isDeleted: true
    }, { new: true }).lean()

    await this.redisService.del(RedisKey.todoByUser(userId));
    await this.redisService.del(RedisKey.todoDetail(id));
    return todo
  }

  async AdminFindAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      this.todoModel
        .find({})
        .populate('userId', 'name email')
        .skip(skip)
        .limit(limit)
        .lean(),
      this.todoModel.countDocuments({})
    ])
    return {
      data: todos,
      total,
      page,
      limit
    };
  }

  async updateTodoByAdmin(id: string, updateTodoByAdminDto: UpdateTodoByAdminDto) {
    return this.todoModel.findByIdAndUpdate(id, updateTodoByAdminDto, { new: true }).populate('userId', 'name email').lean();
  }

  async softDeleteTodoByAdmin(id: string) {
    return this.todoModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).populate('userId', 'name email').lean();
  }

  async restoreTodoByAdmin(id: string) {
    return this.todoModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true }).populate('userId', 'name email').lean();
  }

  async getTotalTodo() {
    return this.todoModel.countDocuments({ isDeleted: false })
  }

  async getCompletedTodo() {
    return this.todoModel.countDocuments({ isDeleted: false, isCompleted: true })
  }

  async getRecentTodos() {
    return await this.todoModel.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email').lean();
  }
}
