import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface UserPayload {
  sub: string;
  isVerified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
