import {
  Controller,
  Post,
  Req,
  UseGuards,
  NotFoundException,
  HttpCode,
  Get,
  Redirect,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { AuthService, GoogleUserProfile, UserPayload } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtAuthGuard } from './guards/refreshJwtAuth.guard';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GoogleLoginDto, LoginUserDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: LoginUserDto })
  async login(@Req() req: Request) {
    const { user } = await this.authService.login(req.user as UserPayload);
    return user;
  }

  /*@Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOkResponse({ description: 'Open OAuth google page' })
  async googleAuth() {
    //
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  @ApiFoundResponse({
    description: 'Returns to frontend with access and refresh tokens',
  })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async googleAuthCallback(@Req() req: Request) {
    if (!req.user) throw new NotFoundException('Google account not found');

    const user = await this.authService.googleLogin(
      req.user as GoogleUserProfile,
    );

    const { user: userData } = await this.authService.login({
      sub: user.userId,
      isVerified: user.isVerified,
    });

    return { url: this.configService.get<string>('CLIENT_URL') };
  }*/

  @Public()
  @Post('google/login')
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse()
  async googleLogin(@Body() data: GoogleLoginDto) {
    try {
      const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      const googleClient = new OAuth2Client(googleClientId);
      await googleClient.verifyIdToken({
        idToken: data.idToken,
        audience: googleClientId,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid idToken');
    }

    const user = await this.authService.googleLoginVerify(data);
    const { user: userData } = await this.authService.login({
      sub: user.userId,
      isVerified: user.email_verified,
    });

    return userData;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginUserDto })
  @ApiUnauthorizedResponse()
  async refresh(@Req() req: Request) {
    const { user } = await this.authService.refresh(req.user as UserPayload);
    return user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user as UserPayload);
  }
}
