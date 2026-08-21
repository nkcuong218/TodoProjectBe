import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema }
    ]),
    RedisModule
  ],
  providers: [TodoService],
  controllers: [TodoController],
  exports: [TodoService]
})
export class TodoModule { }
