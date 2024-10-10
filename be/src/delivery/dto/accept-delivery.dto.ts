import { IsEnum, IsOptional } from 'class-validator';
import { RiderPaymentMethod } from '../delivery.schema';

export class AcceptDeliveryDto {
  @IsEnum(RiderPaymentMethod)
  riderPaymentMethod: RiderPaymentMethod;
}
