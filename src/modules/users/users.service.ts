import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.shema';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileAdminDto } from '../auth/dto/update-profile-admin.dto';
import { ChangePasswordDto } from '../auth/dto/change-password-admin.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
// import { PaginationQueryDto } from '../admin/dto/pagination-query.dto';
import { QueryUserDto } from '../admin/dto/query-user.dto';
import { RedisService } from '../redis/redis.service';
import { RedisKey } from '../../common/redis/redis-key.helper';




@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly redisService: RedisService,
  ) { }

  async createNew(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto)
  }

  async getAllUser(query: QueryUserDto) {
    const { page = 1, limit = 10, search, role } = query;
    const filter: any = {};
    const skip = (page - 1) * limit;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .lean(),

      this.userModel.countDocuments(filter)
    ])
    return {
      data: users,
      total,
      page,
      limit
    };
  }

  async getOneUserById(id: string) {
    return this.userModel.findById(id).lean()
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, lean: true })

    await this.redisService.del(RedisKey.userProfile(id));

    return user;
  }

  async softDeleteUserById(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, lean: true })

    await this.redisService.del(RedisKey.userProfile(id));
    return user;
  }

  async restoreUserById(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true, lean: true })

    await this.redisService.del(RedisKey.userProfile(id));
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).lean()
  }

  async getProfile(userId: string) {
    const cacheKey = RedisKey.userProfile(userId)

    const cacheUser = await this.redisService.get(cacheKey);
    if (cacheUser) {
      console.log('user profile from redis');
      return cacheUser;
    }

    const user = await this.userModel.findById(new Types.ObjectId(userId)).select('-password').lean();
    if (!user) {
      return null;
    }

    await this.redisService.set(cacheKey, user, 300);
    console.log('user profile from db')
    return user
  }

  async updateProfileAdmin(userId: string, updateProfileAdminDto: UpdateProfileAdminDto) {
    const user = await this.userModel.findByIdAndUpdate(new Types.ObjectId(userId), updateProfileAdminDto, { new: true, lean: true }).select('-password');

    await this.redisService.del(RedisKey.userProfile(userId));

    return user;
  }

  async changePasswordAdmin(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(new Types.ObjectId(userId));

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user?.password);

    if (!isMatch) throw new Error('Current password not match!');

    const hasedPass = await bcrypt.hash(changePasswordDto.newPassword, 10);

    const updatedUser = await this.userModel.findByIdAndUpdate(new Types.ObjectId(userId), { password: hasedPass }, { new: true, lean: true }).select('-password');

    await this.redisService.del(RedisKey.userProfile(userId));

    return updatedUser;
  }

  async getTotalUsers() {
    return this.userModel.countDocuments({ isDeleted: false });
  }

  async getUserUser() {
    return this.userModel.countDocuments({ isDeleted: false, role: Role.USER });
  }

  async getRecentUsers() {
    return await this.userModel.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10).select('name email role avatar ');
  }
}
