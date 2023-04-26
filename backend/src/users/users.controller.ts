import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
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
import { ObjectIdPipe } from 'src/shared/pipes/objectId.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async showUser(@Param('userId', ObjectIdPipe) userId: string) {
    const user = await this.usersService.showUser(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async createUser(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.createUser(data);
    } catch (error) {
      throw new ConflictException('There is an user with this email');
    }
  }

  @Patch(':userId')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateUser(
    @Param('userId', ObjectIdPipe) userId: string,
    @Body() data: UpdateUserDto,
  ) {
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

  @Delete(':userId')
  async deleteUser(@Param('userId', ObjectIdPipe) userId: string) {
    try {
      return await this.usersService.deleteUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
