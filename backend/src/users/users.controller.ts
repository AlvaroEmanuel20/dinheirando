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
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserIdDto,
} from './dto/users.dto';
import mongoose from 'mongoose';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  createUserSchema,
  updateUserSchema,
} from './validations/users.validation';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './decorators/user.decorator';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiFoundResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserDto })
  async showUser(@User('sub') userId: string) {
    const user = await this.usersService.showUser(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Public()
  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @ApiCreatedResponse({ type: UserIdDto })
  @ApiConflictResponse()
  async createUser(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.createUser(data);
    } catch (error) {
      throw new ConflictException('There is an user with this email');
    }
  }

  //ROTA DE VALIDAÇÃO DE EMAIL
  @Public()
  @Get('confirm')
  @Redirect()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiFoundResponse({ description: 'Redirect to frontend app' })
  async validateUser(@Query('token') token: string) {
    try {
      await this.usersService.validateUserAccount(token);
      return { url: this.configService.get<string>('CLIENT_URL') };
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError)
        throw new NotFoundException(error.message);

      throw new UnauthorizedException('Invalid email token');
    }
  }

  //ROTA PARA GERAR NOVO EMAIL DE CONFIRMAÇÃO
  @Post('confirm/new')
  @HttpCode(200)
  @ApiNotFoundResponse()
  @ApiOkResponse({ description: 'Send a new confirm email' })
  async newConfirmEmail(@User('sub') userId: string) {
    try {
      await this.usersService.newConfirmEmail(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Patch()
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiOkResponse({ type: UserIdDto })
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

  @Delete()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserIdDto })
  async deleteUser(@User('sub') userId: string) {
    try {
      return await this.usersService.deleteUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
