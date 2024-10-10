import { Module } from '@nestjs/common';
import { PaystackService } from './service';

@Module({
  controllers: [],
  providers: [PaystackService],
})
export class PaystackModule {}
