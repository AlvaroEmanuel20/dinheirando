import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import CustomBusinessError from 'src/shared/utils/CustomBusinessError';

export interface CategoriesQuery {
  limit?: number;
  type?: 'income' | 'expense';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly Category: Model<Category>,
    @InjectModel(Transaction.name)
    private readonly Transaction: Model<Transaction>,
  ) {}

  async showCategories(userId: string, query: CategoriesQuery) {
    return await this.Category.find({ user: userId })
      .limit(query.limit)
      .where({ type: query.type });
  }

  async showCategory(categoryId: string, userId: string) {
    return await this.Category.findOne({ _id: categoryId, user: userId });
  }

  async createCategory(data: CreateCategoryDto, userId: string) {
    const newCategory = await this.Category.create({
      user: userId,
      ...data,
    });

    return { categoryId: newCategory._id };
  }

  async updateCategory(
    data: UpdateCategoryDto,
    categoryId: string,
    userId: string,
  ) {
    await this.Category.updateOne(
      { _id: categoryId, user: userId },
      data,
    ).orFail();
    return { categoryId };
  }

  async deleteCategory(categoryId: string, userId: string) {
    const transactionsUsedCategory = await this.Transaction.find({
      category: categoryId,
    });

    if (transactionsUsedCategory.length > 0)
      throw new CustomBusinessError(
        'There are transactions using this category',
        409,
      );

    await this.Category.deleteOne({ _id: categoryId, user: userId }).orFail();
    return { categoryId };
  }
}
