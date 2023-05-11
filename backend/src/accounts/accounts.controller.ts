import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/users/decorators/user.decorator';
import mongoose from 'mongoose';
import { JoiValidationPipe } from 'src/shared/pipes/joiValidation.pipe';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import {
  AccountDto,
  AccountIdDto,
  CreateAccountDto,
  UpdateAccountDto,
} from './dto/accounts.dto';
import {
  createAccountSchema,
  updateAccountSchema,
} from './validations/accounts.validation';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOkResponse({ type: [AccountDto] })
  async showAccounts(@User('sub') userId: string) {
    return await this.accountsService.showAccounts(userId);
  }

  @Get(':accountId')
  @ApiOkResponse({ type: AccountDto })
  @ApiNotFoundResponse()
  async showAccount(@Param('accountId') accountId: string) {
    const account = await this.accountsService.showAccount(accountId);
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createAccountSchema))
  @ApiCreatedResponse({ type: AccountIdDto })
  @ApiConflictResponse()
  async createAccount(
    @Body() data: CreateAccountDto,
    @User('sub') userId: string,
  ) {
    try {
      return await this.accountsService.createAccount(data, userId);
    } catch (error) {
      throw new ConflictException('There is a account with this name');
    }
  }

  @Patch(':accountId')
  @UsePipes(new JoiValidationPipe(updateAccountSchema))
  @ApiOkResponse({ type: AccountIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async updateAccount(
    @Body() data: UpdateAccountDto,
    @Param('accountId') accountId: string,
  ) {
    try {
      return this.accountsService.updateAccount(data, accountId);
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundException('Account not found');
      } else {
        throw new ConflictException('There is a account with this name');
      }
    }
  }

  @Delete(':accountId')
  @ApiOkResponse({ type: AccountIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async deleteAccount(@Param('accountId') accountId: string) {
    try {
      return this.accountsService.deleteAccount(accountId);
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundException('Account not found');
      } else {
        throw new ConflictException('Account is used in other resources');
      }
    }
  }
}
