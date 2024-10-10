import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery, DeliverySchema } from './delivery.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PaystackModule } from 'src/common/paystack/module';
import { PaystackService } from 'src/common/paystack/service';
import { User, UserSchema } from 'src/user/user.schema';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PaystackModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    PaystackService,
    UserService,
    TransactionService,
  ],
})
export class DeliveryModule {}
