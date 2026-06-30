import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

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

    console.log('step1:')

    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new Error('User not found!')

    console.log('step2:')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Password not match!');

    console.log('step3:')

    const payload = {
      sub: user._id,
      email: user.email,
    }

    console.log('step4: ', payload)

    const accessToken = await this.jwtService.signAsync(payload)
    console.log('step5: ', accessToken)

    const { password: _, ...result } = user;

    return {
      message: 'Login successfully!',
      result,
      accessToken
    }
  }
}
