import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryModule } from './delivery/delivery.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaystackModule } from './common/paystack/module';
import { WebhookModule } from './webhook/webhook.module';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/paystack-side'),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    PaystackModule,
    UserModule,
    WebhookModule,
    DeliveryModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
