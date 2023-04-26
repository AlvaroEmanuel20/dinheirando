import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  HttpCode,
  Get,
  Redirect,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { AuthService, UserPayload } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { GoogleProfile } from './strategies/google.strategy';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions = {
    maxAge: this.configService.get<number>('COOKIE_MAX_AGE'),
    secure: process.env.NODE_ENV === 'production',
    sameSite: this.configService.get<boolean | 'lax' | 'strict' | 'none'>(
      'COOKIE_SAME_SITE',
    ),
    httpOnly: true,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.login(
      req.user as UserPayload,
    );

    res.cookie('access_token', accessToken, this.cookieOptions);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    //
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect('http://localhost:3000/')
  async googleAuthCallback(@Req() req: Request) {
    try {
      const user = await this.authService.googleLogin(
        req.user as GoogleProfile,
      );

      return { url: this.configService.get<string>('CLIENT_URL') };
    } catch (error) {
      throw new NotFoundException('Google account not found');
    }
  }
}
