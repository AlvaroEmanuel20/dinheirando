import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  Query,
  Redirect,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/auth/decorators/public.decorator';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  putResetPasswordSchema,
  resetPasswordSchema,
} from './validations/users.validation';
import { PutResetPasswordDto, ResetPasswordDto } from './dto/users.dto';
import { PasswordService } from './password.service';
import mongoose from 'mongoose';

@Controller('password')
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  //ROUTE THAT SEND RESET EMAIL
  @Public()
  @Post('reset')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  @HttpCode(200)
  async resetPassword(@Body() data: ResetPasswordDto) {
    try {
      await this.passwordService.resetPassword(data);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  //ROUTE THAT VERIFY TOKEN AND REDIRECT TO NEW PASSWORD PAGE
  @Public()
  @Get('reset/confirm')
  @Redirect()
  async confirmResetPassword(@Query('token') token: string) {
    try {
      const clientUrl = this.configService.get<string>('CLIENT_URL');
      const tokenResult = await this.passwordService.confirmResetPassword(
        token,
      );

      return { url: `${clientUrl}/senha/nova?token=${tokenResult}` };
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError)
        throw new NotFoundException('User not found');

      throw new UnauthorizedException('Invalid password token');
    }
  }

  @Public()
  @Put()
  @UsePipes(new JoiValidationPipe(putResetPasswordSchema))
  @Redirect()
  async putResetPassword(@Body() data: PutResetPasswordDto) {
    try {
      await this.passwordService.putResetPassword(data);
      return { url: this.configService.get<string>('CLIENT_URL') };
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError)
        throw new NotFoundException('User not found');

      throw new UnauthorizedException('Invalid token');
    }
  }
}
