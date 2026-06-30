import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() regiterDto: RegisterDto) {
    return this.authService.register(regiterDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log('Controller login');

    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return {
      message: 'Get me success',
      user: req.user,
    }
  }
}
