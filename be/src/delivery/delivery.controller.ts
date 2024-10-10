import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/guards/role.helper';
import { HttpResponseHelper } from 'src/common/helper/http-response.helper';
import { Request as ExpressRequest } from 'express';
import { DeliveryStatus } from './delivery.schema';
import { AcceptDeliveryDto } from './dto/accept-delivery.dto';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Role('user')
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req: ExpressRequest,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ) {
    const data = await this.deliveryService.create(
      req.user.id,
      createDeliveryDto,
    );
    return HttpResponseHelper.send('Created delivery', data);
  }
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/user:mine')
  async findUserDeliveries(@Request() req: ExpressRequest) {
    const data = await this.deliveryService.findUserDeliveries(req.user.id);
    return HttpResponseHelper.send('User deliveries', data);
  }

  @Role('rider')
  @UseGuards(AuthGuard)
  @Get('/rider:mine')
  async findRiderDeliveries(@Request() req: ExpressRequest) {
    const data = await this.deliveryService.findRiderDeliveries(req.user.id);
    return HttpResponseHelper.send('Rider deliveries', data);
  }

  @Get('/open')
  async findOpenDeliveries() {
    const data = await this.deliveryService.findDeliveries(DeliveryStatus.OPEN);
    return HttpResponseHelper.send('Open deliveries', data);
  }

  @UseGuards(AuthGuard)
  @Get('/verify')
  async verifyPayment(
    @Request() req: ExpressRequest,
    @Query('reference') reference: string,
  ) {
    const data = await this.deliveryService.verifyDeliveryPayment(
      req.user.id,
      reference,
    );
    return HttpResponseHelper.send('Delivery confirmed', data);
  }

  @Role('rider')
  @UseGuards(AuthGuard)
  @Patch('/:id/accept')
  async acceptDelivery(
    @Param('id') deliveryId: string,
    @Req() req: ExpressRequest,
    @Body() acceptDeliveryDto: AcceptDeliveryDto,
  ) {
    const data = await this.deliveryService.acceptDelivery(
      deliveryId,
      req.user.id,
      acceptDeliveryDto.riderPaymentMethod,
    );

    return HttpResponseHelper.send('Delivery accepted', data);
  }

  @Role('user')
  @UseGuards(AuthGuard)
  @Patch('/:id/payment')
  async paymentForDelivery(
    @Param('id') deliveryId: string,
    @Req() req: ExpressRequest,
  ) {
    const data = await this.deliveryService.createDeliveryPayment(
      req.user.id,
      deliveryId,
    );

    return HttpResponseHelper.send('Delivery accepted', data);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDeliveryDto: UpdateDeliveryDto,
  // ) {
  //   return this.deliveryService.update(+id, updateDeliveryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.deliveryService.remove(+id);
  // }
}
