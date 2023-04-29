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
import { AuthService, GoogleUserProfile, UserPayload } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtAuthGuard } from './guards/refreshJwtAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';

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
    const { accessToken, refreshToken } = await this.authService.login(
      req.user as UserPayload,
    );

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);
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
  @Redirect()
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) throw new NotFoundException('Google account not found');
    const user = await this.authService.googleLogin(
      req.user as GoogleUserProfile,
    );

    const { accessToken, refreshToken } = await this.authService.login({
      sub: user.userId,
      isVerified: user.isVerified,
    });

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);
    return { url: this.configService.get<string>('CLIENT_URL') };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user as UserPayload,
    );

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user as UserPayload);
    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);
  }
}
