import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileAdminDto } from './dto/update-profile-admin.dto';
import { ChangePasswordDto } from './dto/change-password-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hasedPass = await bcrypt.hash(password, 10);
    const user = await this.usersService.createNew({ name, email, password: hasedPass })
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new Error('User not found!')

    if (user.isDeleted) {
      throw new Error('This account has been deleted!');
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Password not match!');

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    }

    const accessToken = await this.jwtService.signAsync(payload)

    const { password: _, ...result } = user;

    return {
      message: 'Login successfully!',
      result,
      accessToken
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.getProfile(userId);
    return user;
  }

  async updateProfileAdmin(userId: string, updateProfileAdminDto: UpdateProfileAdminDto) {
    const user = await this.usersService.updateProfileAdmin(userId, updateProfileAdminDto);
    return user;
  }

  async changePasswordAdmin(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.changePasswordAdmin(userId, changePasswordDto)
    return user;
  }
}
