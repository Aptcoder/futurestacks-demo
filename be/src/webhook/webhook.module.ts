import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from 'src/delivery/delivery.schema';
import { PaystackModule } from 'src/common/paystack/module';
import { UserModule } from 'src/user/user.module';
import { PaystackService } from 'src/common/paystack/service';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/user.schema';
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
      { name: Delivery.name, schema: DeliverySchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PaystackModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService, TransactionService, PaystackService, UserService],
})
export class WebhookModule {}
