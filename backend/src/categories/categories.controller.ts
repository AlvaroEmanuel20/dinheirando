import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { CategoriesQuery, CategoriesService } from './categories.service';
import { User } from 'src/users/decorators/user.decorator';
import {
  CategoryDto,
  CategoryIdDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/categories.dto';
import mongoose from 'mongoose';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  createCategorySchema,
  updateCategorySchema,
} from './validations/categories.validation';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({ type: [CategoryDto] })
  async showCategories(
    @User('sub') userId: string,
    @Query('query') query: CategoriesQuery,
  ) {
    return await this.categoriesService.showCategories(userId, query);
  }

  @Get(':categoryId')
  @ApiOkResponse({ type: CategoryDto })
  @ApiNotFoundResponse()
  async showCategory(@Param('categoryId') categoryId: string) {
    const category = await this.categoriesService.showCategory(categoryId);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  @ApiCreatedResponse({ type: CategoryIdDto })
  @ApiConflictResponse()
  async createCategory(
    @Body() data: CreateCategoryDto,
    @User('sub') userId: string,
  ) {
    try {
      return await this.categoriesService.createCategory(data, userId);
    } catch (error) {
      throw new ConflictException('There is a category with this name');
    }
  }

  @Patch(':categoryId')
  @UsePipes(new JoiValidationPipe(updateCategorySchema))
  @ApiOkResponse({ type: CategoryIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async updateCategory(
    @Body() data: UpdateCategoryDto,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      return this.categoriesService.updateCategory(data, categoryId);
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundException('Category not found');
      } else {
        throw new ConflictException('There is a category with this name');
      }
    }
  }

  @Delete(':categoryId')
  @ApiOkResponse({ type: CategoryIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async deleteCategory(@Param('categoryId') categoryId: string) {
    try {
      return this.categoriesService.deleteCategory(categoryId);
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundException('Category not found');
      } else {
        throw new ConflictException('Category is used in other resources');
      }
    }
  }
}
