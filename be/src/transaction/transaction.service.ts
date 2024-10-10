import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaystackService } from 'src/common/paystack/service';
import { ResolveAccountDTO } from './dto/resolve-account-dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly paystackService: PaystackService,
  ) {}
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionModel.create({
      user: userId,
      ...createTransactionDto,
    });
    return transaction;
  }

  findUserTransactions(userId: string) {
    return this.transactionModel
      .find({
        user: userId,
      })
      .sort({
        createdAt: 'desc',
      });
  }

  findWithReference(reference: string) {
    return this.transactionModel.findOne({
      reference,
    });
  }

  async getAllBanks() {
    const response = await this.paystackService.getBanks();
    if (!response.success) {
      throw new InternalServerErrorException('Could not get all banks');
    }
    return response.banks;
  }

  async resolveAccount(resolveAccountDto: ResolveAccountDTO) {
    const response = await this.paystackService.resolveBankAccount({
      accountNumber: resolveAccountDto.accountNumber,
      bankCode: resolveAccountDto.bankCode,
    });

    if (!response.success) {
      throw new InternalServerErrorException('Could not resolve account');
    }

    return {
      accountNumber: response.accountNumber,
      accountName: response.accountName,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
