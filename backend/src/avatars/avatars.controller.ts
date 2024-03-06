import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/decorators/user.decorator';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AvatarSuccessUploadDto, AvatarUrlDto } from './dto/avatars.dto';

@ApiTags('avatars')
@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ type: AvatarSuccessUploadDto })
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 500000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File,
    @User('sub') userId: string
  ) {
    try {
      const result = await this.avatarsService.uploadAvatar(file, userId);
      if (!result.uploaded || !result.imageId)
        throw new InternalServerErrorException(
          'Server error when uploading avatar'
        );

      return result;
    } catch (error) {}
  }

  @Get()
  @ApiOkResponse({ type: AvatarUrlDto })
  @ApiNotFoundResponse()
  async getAvatarUrl(@User('sub') userId: string) {
    try {
      const url = await this.avatarsService.getAvatarUrl(userId);
      return { avatarUrl: url };
    } catch (error) {
      throw new NotFoundException('Avatar not found');
    }
  }
}
