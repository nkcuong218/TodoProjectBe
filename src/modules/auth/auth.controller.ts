import { Body, Controller, Post, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileAdminDto } from './dto/update-profile-admin.dto';
import { ChangePasswordDto } from './dto/change-password-admin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request - Email already exists or validation error' })
  register(@Body() regiterDto: RegisterDto) {
    return this.authService.register(regiterDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    console.log('Controller login');

    return this.authService.login(loginDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user session' })
  @ApiResponse({ status: 200, description: 'Session user payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req) {
    return {
      message: 'Get me success',
      user: req.user,
    };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update profile information' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfileAdmin(@Req() req, @Body() updateProfileAdminDto: UpdateProfileAdminDto) {
    return this.authService.updateProfileAdmin(req.user.userId, updateProfileAdminDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Incorrect current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePasswordAdmin(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePasswordAdmin(req.user.userId, changePasswordDto);
  }
}
