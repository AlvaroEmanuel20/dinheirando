import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { ServiceTokensService } from 'src/serviceTokens/serviceTokens.service';

export interface UserPayload {
  sub: string | Types.ObjectId;
  isVerified: boolean;
  iat?: number;
  exp?: number;
}

export interface GoogleUserProfile {
  name: string;
  email: string;
  isVerified: boolean;
  photos: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly serviceTokenService: ServiceTokensService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.showUserByEmail(email);
    if (!user) return null;

    const comparePass = await compare(password, user.password);
    if (!comparePass) return null;

    return {
      sub: user._id,
      isVerified: user.isVerified,
    };
  }

  async login(user: UserPayload) {
    await this.serviceTokenService.deleteTokens(user.sub, 'REFRESH');

    const refreshToken = this.jwtService.sign(
      { sub: user.sub, isVerified: user.isVerified },
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get<string | number>(
          'REFRESH_JWT_EXPIRES_IN',
        ),
      },
    );

    await this.serviceTokenService.create({
      token: refreshToken,
      user: user.sub,
      serviceType: 'REFRESH',
    });

    return {
      accessToken: this.jwtService.sign({
        sub: user.sub,
        isVerified: user.isVerified,
      }),
      refreshToken,
    };
  }

  async logout(user: UserPayload) {
    await this.serviceTokenService.deleteTokens(user.sub, 'REFRESH');
  }

  async googleLogin(user: GoogleUserProfile) {
    const findUser = await this.usersService.showUserByEmail(user.email);
    if (!findUser) {
      const createdUser = await this.usersService.createUser({
        name: user.name,
        email: user.email,
        avatar: user.photos,
        isVerified: user.isVerified,
        isGoogleAccount: true,
        password: '',
      });

      return { ...user, userId: createdUser.userId };
    }

    return { ...user, userId: findUser._id };
  }
}
