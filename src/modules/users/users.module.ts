import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from 'src/modules/users/schemas/user.shema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    RedisModule,
  ],
  providers: [UsersService, RoleGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
