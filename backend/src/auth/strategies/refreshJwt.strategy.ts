import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from '../auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '../schemas/refreshToken.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refreshJwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.usersService.showUser(payload.sub as string);
    if (!user) throw new NotFoundException('User not found');

    const refreshToken = await this.refreshTokenModel.findOne({
      user: payload.sub,
    });

    if (refreshToken.isInvalid)
      throw new UnauthorizedException('Blocked refresh token');

    return payload;
  }
}
