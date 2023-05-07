import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refreshToken.schema';
import { GoogleLoginDto } from './dto/auth.dto';

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
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
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
    const userData = await this.usersService.showUser(user.sub as string);

    let refreshToken: string;
    const existsRefreshToken = await this.refreshTokenModel.findOne({
      user: user.sub,
    });

    if (existsRefreshToken) {
      try {
        await this.jwtService.verifyAsync(existsRefreshToken.token, {
          secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        });

        refreshToken = existsRefreshToken.token;
      } catch (error) {
        await this.refreshTokenModel.deleteOne({
          token: existsRefreshToken.token,
        });

        refreshToken = await this.generateRefreshToken(user);
      }
    } else {
      refreshToken = await this.generateRefreshToken(user);
    }

    return {
      user: {
        userId: userData.id as string,
        avatar: userData.avatar,
        name: userData.name,
        email: userData.email,
        isVerified: userData.isVerified,
        isGoogleAccount: userData.isGoogleAccount,
        accessToken: this.jwtService.sign({
          sub: user.sub,
          isVerified: user.isVerified,
        }),
        refreshToken,
      },
    };
  }

  async refresh(user: UserPayload) {
    const userData = await this.usersService.showUser(user.sub as string);
    const storedRefreshToken = await this.refreshTokenModel.findOne({
      user: user.sub,
    });

    return {
      user: {
        userId: userData.id as string,
        avatar: userData.avatar,
        name: userData.name,
        email: userData.email,
        isVerified: userData.isVerified,
        isGoogleAccount: userData.isGoogleAccount,
        accessToken: this.jwtService.sign({
          sub: user.sub,
          isVerified: user.isVerified,
        }),
        refreshToken: storedRefreshToken.token,
      },
    };
  }

  async logout(user: UserPayload) {
    await this.refreshTokenModel.deleteOne({ user: user.sub });
  }

  /*async googleLogin(user: GoogleUserProfile) {
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
  }*/

  async googleLoginVerify(data: GoogleLoginDto) {
    const findUser = await this.usersService.showUserByEmail(data.email);
    if (!findUser) {
      const createdUser = await this.usersService.createUser({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        isVerified: data.email_verified,
        isGoogleAccount: true,
        password: '',
      });

      return { userId: createdUser.userId, ...data };
    }

    return { ...data, userId: findUser._id };
  }

  private async generateRefreshToken(user: UserPayload) {
    const refreshToken = this.jwtService.sign(
      { sub: user.sub, isVerified: user.sub },
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRES_IN'),
      },
    );

    await this.refreshTokenModel.create({
      token: refreshToken,
      user: user.sub,
    });

    return refreshToken;
  }
}
