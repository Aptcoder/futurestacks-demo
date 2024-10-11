import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryModule } from './delivery/delivery.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaystackModule } from './common/paystack/module';
import { WebhookModule } from './webhook/webhook.module';
import { LoggerModule } from 'nestjs-pino';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('database_url')),
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
