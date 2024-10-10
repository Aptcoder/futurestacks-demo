import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { PaystackModule } from 'src/common/paystack/module';
import { PaystackService } from 'src/common/paystack/service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PaystackModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PaystackService],
})
export class TransactionModule {}
