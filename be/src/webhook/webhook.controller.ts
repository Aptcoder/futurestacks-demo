import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { createHmac } from 'crypto';
import * as config from 'config';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/paystack')
  create(@Body() data: any, @Req() req) {
    const paystack_secret = config.get('paystack_key');
    const hash = createHmac('sha512', paystack_secret)
      .update(JSON.stringify(data))
      .digest('hex');

    if (hash != req.headers['x-paystack-signature']) {
      throw new UnauthorizedException('Invalid paystack hash');
    }

    return this.webhookService.handlePaystack(data);
  }

  //   @Get()
  //   findAll() {
  //     return this.walletService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.walletService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
  //     return this.walletService.update(+id, updateWalletDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.walletService.remove(+id);
  //   }
}
