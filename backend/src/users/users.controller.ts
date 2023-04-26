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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import mongoose from 'mongoose';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  createUserSchema,
  updateUserSchema,
} from './validations/users.validation';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Delete()
  async deleteUser(@User('sub') userId: string) {
    try {
      return await this.usersService.deleteUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
