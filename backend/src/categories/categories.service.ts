import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

export interface CategoriesQuery {
  limit?: number;
  type?: 'income' | 'expense';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly Category: Model<Category>,
  ) {}

  async showCategories(userId: string, query: CategoriesQuery) {
    return await this.Category.find({ user: userId })
      .limit(query.limit)
      .where({ type: query.type });
  }

  async showCategory(categoryId: string) {
    return await this.Category.findById(categoryId);
  }

  async createCategory(data: CreateCategoryDto, userId: string) {
    const newCategory = await this.Category.create({
      user: userId,
      ...data,
    });

    return { categoryId: newCategory._id };
  }

  async updateCategory(data: UpdateCategoryDto, categoryId: string) {
    await this.Category.findByIdAndUpdate(categoryId, data).orFail();
    return { categoryId };
  }

  async deleteCategory(categoryId: string) {
    await this.Category.findByIdAndDelete(categoryId).orFail();
    return { categoryId };
  }
}
