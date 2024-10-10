import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request as ExpressRequest } from 'express';
import { HttpResponseHelper } from 'src/common/helper/http-response.helper';
import { ResolveAccountDTO } from './dto/resolve-account-dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

  @UseGuards(AuthGuard)
  @Get('/mine')
  async findAll(@Req() req: ExpressRequest) {
    const transactions = await this.transactionService.findUserTransactions(
      req.user.id,
    );
    return HttpResponseHelper.send('Own transactions', transactions);
  }

  @UseGuards(AuthGuard)
  @Get('/banks')
  async getAllBanks() {
    const banks = await this.transactionService.getAllBanks();
    return HttpResponseHelper.send('Banks', banks);
  }

  @UseGuards(AuthGuard)
  @Get('/banks/resolve_account')
  async resolveBankAccount(@Query() query: ResolveAccountDTO) {
    const data = await this.transactionService.resolveAccount(query);
    return HttpResponseHelper.send('Account details', data);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}
