import {
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { AuthService, UserPayload } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtAuthGuard } from './guards/refreshJwtAuth.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GoogleLoginDto, LoggedUserDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: LoggedUserDto })
  async login(@Req() req: Request) {
    const { user } = await this.authService.login(req.user as UserPayload);
    return user;
  }

  @Public()
  @Post('google/login')
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse()
  async googleLogin(@Body() data: GoogleLoginDto) {
    //This route is a auxiliar to frontend google authentication with NextAuth
    //Verify if google credentials of user is OK
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
  @ApiOkResponse({ type: LoggedUserDto })
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
