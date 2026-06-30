import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';

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
    UsersModule,
    AuthModule,
    TodoModule
  ],
})
export class AppModule { }
