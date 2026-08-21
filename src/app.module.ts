import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log("Database connected");
          })
          connection.on('error', (err) => {
            console.log("Database connection failed", err);
          })
          connection.on('disconnected', () => {
            console.log("Database disconnected");
          })
          return connection;
        }
      })
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      }
    ]),
    UsersModule,
    AuthModule,
    TodoModule,
    AdminModule,
    RedisModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
