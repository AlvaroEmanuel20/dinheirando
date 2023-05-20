import {
  Body,
  Controller,
  Get,
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
import {
  PutResetPasswordDto,
  ResetPasswordDto,
  UserIdDto,
} from './dto/users.dto';
import { PasswordService } from './password.service';
import mongoose from 'mongoose';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('passwords')
@Controller('passwords')
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  //ROUTE THAT SEND RESET EMAIL
  @Public()
  @Post('reset')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  @ApiNotFoundResponse()
  @ApiCreatedResponse({ description: 'Send a reset password email' })
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
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiFoundResponse({ description: 'Redirect to reset pass page' })
  async confirmResetPassword(@Query('token') token: string) {
    try {
      const clientUrl = this.configService.get<string>('CLIENT_URL');
      const tokenResult = await this.passwordService.confirmResetPassword(
        token,
      );

      return { url: `${clientUrl}/senha/nova?token=${tokenResult}` };
    } catch (error) {
      if (error.message === 'Blocked password token')
        throw new UnauthorizedException(error.message);

      if (error instanceof mongoose.Error.DocumentNotFoundError)
        throw new NotFoundException('User not found');

      throw new UnauthorizedException('Invalid password token');
    }
  }

  @Public()
  @Put()
  @UsePipes(new JoiValidationPipe(putResetPasswordSchema))
  @ApiOkResponse({ type: UserIdDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async putResetPassword(@Body() data: PutResetPasswordDto) {
    try {
      const response = await this.passwordService.putResetPassword(data);
      return response;
    } catch (error) {
      if (error.message === 'Blocked password token')
        throw new UnauthorizedException(error.message);

      if (error instanceof mongoose.Error.DocumentNotFoundError)
        throw new NotFoundException('User not found');

      throw new UnauthorizedException('Invalid token');
    }
  }
}
