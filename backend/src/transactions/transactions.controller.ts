import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  NotFoundException,
  UsePipes,
  Query,
  HttpException,
} from '@nestjs/common';
import { User } from 'src/users/decorators/user.decorator';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsQuery, TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  TransactionDto,
  TransactionIdDto,
  TransactionsTotalDto,
  UpdateTransactionDto,
} from './dto/transactions.dto';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from './validations/transactions.validations';
import { ObjectIdValidationPipe } from 'src/shared/pipes/objectIdValidation.pipe';
import CustomBusinessError from 'src/shared/utils/CustomBusinessError';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({ type: [TransactionDto] })
  async showTransactions(
    @User('sub') userId: string,
    @Query() query: TransactionsQuery,
  ) {
    return await this.transactionsService.showTransactions(userId, query);
  }

  @Get('total')
  @ApiOkResponse({ type: TransactionsTotalDto })
  async showTotal(@User('sub') userId: string) {
    const result = await this.transactionsService.showTotal(userId);
    return result;
  }

  @Get(':transactionId')
  @ApiOkResponse({ type: TransactionDto })
  @ApiNotFoundResponse()
  async showTransaction(
    @Param('transactionId', ObjectIdValidationPipe) transactionId: string,
    @User('sub') userId: string,
  ) {
    const transaction = await this.transactionsService.showTransaction(
      transactionId,
      userId,
    );

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createTransactionSchema))
  @ApiCreatedResponse({ type: TransactionIdDto })
  @ApiNotFoundResponse({ description: 'Category or account not found' })
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User('sub') userId: string,
  ) {
    try {
      return await this.transactionsService.createTransaction(data, userId);
    } catch (error) {
      if (error instanceof CustomBusinessError) {
        throw new HttpException(error.message, error.status);
      }
    }
  }

  @Patch(':transactionId')
  @UsePipes(new JoiValidationPipe(updateTransactionSchema))
  @ApiOkResponse({ type: TransactionIdDto })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiNotFoundResponse({ description: 'New category or account not found' })
  async updateTransaction(
    @Body() data: UpdateTransactionDto,
    @Param('transactionId', ObjectIdValidationPipe) transactionId: string,
    @User('sub') userId: string,
  ) {
    try {
      return await this.transactionsService.updateTransaction(
        data,
        transactionId,
        userId,
      );
    } catch (error) {
      if (error instanceof CustomBusinessError) {
        throw new HttpException(error.message, error.status);
      }
    }
  }

  @Delete(':transactionId')
  @ApiOkResponse({ type: TransactionIdDto })
  @ApiNotFoundResponse()
  async deleteTransaction(
    @Param('transactionId', ObjectIdValidationPipe) transactionId: string,
    @User('sub') userId: string,
  ) {
    try {
      return await this.transactionsService.deleteTransaction(
        transactionId,
        userId,
      );
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
