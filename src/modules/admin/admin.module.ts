import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [UsersModule, TodoModule],
  controllers: [AdminController],
  providers: [AdminService],
  // exports: [AdminService]
})
export class AdminModule { }
