import { ApiProperty } from '@nestjs/swagger';

export class AvatarSuccessUploadDto {
  @ApiProperty()
  imageId: string;

  @ApiProperty()
  uploaded: boolean;
}

export class AvatarUrlDto {
  @ApiProperty()
  avatarUrl: string;
}
