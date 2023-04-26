import { Controller, Post, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { AuthService, UserPayload } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return this.authService.login(req.user as UserPayload);
  }
}
