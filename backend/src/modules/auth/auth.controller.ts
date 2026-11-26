import { Controller, Post, Get, Body, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerTourist(@Body() body: any) {
    const { firstName, lastName, email, password, phone } = body;
    const result = await this.authService.registerTourist(firstName, lastName, email, password, phone);
    return {
      success: true,
      statusCode: 201,
      message: 'Tourist registered successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password, role } = body;
    const result = await this.authService.login(email, password, role);
    return {
      success: true,
      statusCode: 200,
      message: 'Login successful.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    const { userId, role } = req.user;
    const profile = await this.authService.getProfile(userId, role);
    return {
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully.',
      data: profile,
      timestamp: new Date().toISOString(),
    };
  }
}
