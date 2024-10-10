import { IsInt, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  packageName: string;

  @IsInt()
  distance: number;

  @IsString()
  pickupLocation: string;

  @IsString()
  dropOffLocation: string;

  @IsInt()
  price: number;
}
