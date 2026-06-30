import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.shema';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createNew(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto)
  }

  async getAllUser() {
    return this.userModel.find().lean()
  }

  async getOneUserById(id: string) {
    return this.userModel.findById(id).lean()
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, lean: true })
  }

  async softDeleteUserById(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, lean: true })
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).lean()
  }
}
