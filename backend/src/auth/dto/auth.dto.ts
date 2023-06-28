import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isGoogleAccount: boolean;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class GoogleLoginDto {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  email_verified: boolean;

  @ApiProperty()
  idToken: string;
}
