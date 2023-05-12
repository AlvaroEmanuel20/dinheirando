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
  ConflictException,
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
import { TransfersQuery, TransfersService } from './transfers.service';
import {
  CreateTransferDto,
  TransferDto,
  TransferIdDto,
  UpdateTransferDto,
} from './dto/transfers.dto';
import {
  createTransferSchema,
  updateTransferSchema,
} from './validations/transfers.validations';
import { ObjectIdValidationPipe } from 'src/shared/pipes/objectIdValidation.pipe';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOkResponse({ type: [TransferDto] })
  async showTransfers(
    @User('sub') userId: string,
    @Query() query: TransfersQuery,
  ) {
    return await this.transfersService.showTransfers(userId, query);
  }

  @Get(':transferId')
  @ApiOkResponse({ type: TransferDto })
  @ApiNotFoundResponse()
  async showTransfer(
    @Param('transferId', ObjectIdValidationPipe) transferId: string,
    @User('sub') userId: string,
  ) {
    const transfer = await this.transfersService.showTransfer(
      transferId,
      userId,
    );
    if (!transfer) throw new NotFoundException('Transfer not found');
    return transfer;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createTransferSchema))
  @ApiCreatedResponse({ type: TransferIdDto })
  @ApiConflictResponse()
  async createTransfer(
    @Body() data: CreateTransferDto,
    @User('sub') userId: string,
  ) {
    try {
      return await this.transfersService.createTransfer(data, userId);
    } catch (error) {
      if (
        error.message === 'From account not found' ||
        error.message === 'To account not found'
      ) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Patch(':transferId')
  @UsePipes(new JoiValidationPipe(updateTransferSchema))
  @ApiOkResponse({ type: TransferIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async updateTransfer(
    @Body() data: UpdateTransferDto,
    @Param('transferId', ObjectIdValidationPipe) transferId: string,
    @User('sub') userId: string,
  ) {
    try {
      return this.transfersService.updateTransfer(data, transferId, userId);
    } catch (error) {
      if (
        error.message === 'Transfer not found' ||
        error.message === 'New from account not found' ||
        error.message === 'New to account not found'
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error.message === 'From account is equals to account' ||
        error.message === 'To account is equals from account'
      ) {
        throw new ConflictException(error.message);
      }
    }
  }

  @Delete(':transferId')
  @ApiOkResponse({ type: TransferIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async deleteTransfer(
    @Param('transferId', ObjectIdValidationPipe) transferId: string,
    @User('sub') userId: string,
  ) {
    try {
      return this.transfersService.deleteTransfer(transferId, userId);
    } catch (error) {
      throw new NotFoundException('Transfer not found');
    }
  }
}
