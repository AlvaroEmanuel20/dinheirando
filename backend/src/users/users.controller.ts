import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
  Body,
  UsePipes,
  Query,
  Redirect,
  UnauthorizedException,
  InternalServerErrorException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  PutResetPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dto/users.dto';
import mongoose from 'mongoose';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  createUserSchema,
  putResetPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
} from './validations/users.validation';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async showUser(@User('sub') userId: string) {
    const user = await this.usersService.showUser(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Public()
  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async createUser(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.createUser(data);
    } catch (error) {
      throw new ConflictException('There is an user with this email');
    }
  }

  //ROTA DE VALIDAÇÃO DE EMAIL
  @Public()
  @Get('account/confirm')
  @Redirect()
  async validateUser(@Query('token') token: string) {
    try {
      await this.usersService.validateUserAccount(token);
      return { url: this.configService.get<string>('CLIENT_URL') };
    } catch (error) {
      throw new UnauthorizedException('Invalid email token');
    }
  }

  //ROTA PARA GERAR NOVO EMAIL DE CONFIRMAÇÃO
  @Post('account/confirm/new')
  async newConfirmEmail(@User('sub') userId: string) {
    try {
      await this.usersService.newConfirmEmail(userId);
    } catch (error) {
      throw new InternalServerErrorException('Error to generate confirm email');
    }
  }

  @Patch()
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateUser(@User('sub') userId: string, @Body() data: UpdateUserDto) {
    try {
      return await this.usersService.updateUser(data, userId);
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundException('User not found');
      } else {
        throw new ConflictException('There is an user with this email');
      }
    }
  }

  //ROTA PARA RESETAR A SENHA
  @Public()
  @Post('password/reset')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  @HttpCode(200)
  async resetPassword(@Body() data: ResetPasswordDto) {
    try {
      //
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  //ROTA PARA REDIRECIONAR A TELA DE NOVA SENHA
  @Public()
  @Get('password/reset/confirm')
  @Redirect()
  async confirmResetPassword(@Query('token') token: string) {
    try {
      //
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  //ROTA PARA ATUALIZAR NOVA SENHA
  @Public()
  @Put('password')
  @UsePipes(new JoiValidationPipe(putResetPasswordSchema))
  @Redirect()
  async putResetPassword(@Body() data: PutResetPasswordDto) {
    try {
      //
    } catch (error) {
      //
    }
  }

  @Delete()
  async deleteUser(@User('sub') userId: string) {
    try {
      return await this.usersService.deleteUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
