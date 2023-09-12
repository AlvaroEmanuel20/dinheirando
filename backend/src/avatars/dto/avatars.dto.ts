import { ApiProperty } from '@nestjs/swagger';

export class AvatarUploadDto {
  @ApiProperty()
  imageId: string;

  @ApiProperty()
  uploaded: boolean;
}

export class AvatarUrlDto {
  @ApiProperty()
  avatarUrl: string;
}
