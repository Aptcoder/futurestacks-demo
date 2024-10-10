import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { PaystackModule } from 'src/common/paystack/module';
import { PaystackService } from 'src/common/paystack/service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PaystackModule,
    TransactionModule,
  ],
  controllers: [UserController],
  providers: [UserService, PaystackService, TransactionService],
  exports: [UserService],
})
export class UserModule {}
