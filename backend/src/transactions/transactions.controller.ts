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
} from '@nestjs/common';
import { User } from 'src/users/decorators/user.decorator';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  ApiConflictResponse,
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
  @ApiConflictResponse()
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @User('sub') userId: string,
  ) {
    try {
      return await this.transactionsService.createTransaction(data, userId);
    } catch (error) {
      if (
        error.message === 'Category not found' ||
        error.message === 'Account not found'
      ) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Patch(':transactionId')
  @UsePipes(new JoiValidationPipe(updateTransactionSchema))
  @ApiOkResponse({ type: TransactionIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async updateTransaction(
    @Body() data: UpdateTransactionDto,
    @Param('transactionId', ObjectIdValidationPipe) transactionId: string,
    @User('sub') userId: string,
  ) {
    try {
      return this.transactionsService.updateTransaction(
        data,
        transactionId,
        userId,
      );
    } catch (error) {
      if (
        error.message === 'Transaction not found' ||
        error.message === 'New category not found' ||
        error.message === 'New account not found'
      ) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Delete(':transactionId')
  @ApiOkResponse({ type: TransactionIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async deleteTransaction(
    @Param('transactionId', ObjectIdValidationPipe) transactionId: string,
    @User('sub') userId: string,
  ) {
    try {
      return this.transactionsService.deleteTransaction(transactionId, userId);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
