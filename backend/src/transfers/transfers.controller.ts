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
  async showTransfer(@Param('transferId') transferId: string) {
    const transfer = await this.transfersService.showTransfer(transferId);
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
    return await this.transfersService.createTransfer(data, userId);
  }

  @Patch(':transferId')
  @UsePipes(new JoiValidationPipe(updateTransferSchema))
  @ApiOkResponse({ type: TransferIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async updateTransfer(
    @Body() data: UpdateTransferDto,
    @Param('transferId') transferId: string,
  ) {
    try {
      return this.transfersService.updateTransfer(data, transferId);
    } catch (error) {
      throw new NotFoundException('Transfer not found');
    }
  }

  @Delete(':transferId')
  @ApiOkResponse({ type: TransferIdDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async deleteTransfer(@Param('transferId') transferId: string) {
    try {
      return this.transfersService.deleteTransfer(transferId);
    } catch (error) {
      throw new NotFoundException('Transfer not found');
    }
  }
}
