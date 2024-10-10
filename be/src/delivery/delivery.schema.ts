import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/user.schema';

export type DeliveryDocument = HydratedDocument<Delivery>;

export enum DeliveryStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ACCEPTED = 'accepted',
}

export enum RiderPaymentMethod {
  WALLET = 'wallet',
  DISBURSE = 'disburse',
}

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Delivery {
  @Prop({})
  packageName: string;

  @Prop({})
  distance: number;

  @Prop()
  pickupLocation: string;

  @Prop()
  dropOffLocation: string;

  @Prop()
  price: number;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: UserDocument;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  })
  rider: UserDocument;

  @Prop({
    default: DeliveryStatus.OPEN,
    type: String,
    enum: DeliveryStatus,
  })
  status: DeliveryStatus;

  @Prop({
    required: false,
  })
  paymentUrl: string;

  @Prop({
    required: false,
  })
  paymentReference: string;

  @Prop({
    default: RiderPaymentMethod.WALLET,
    type: String,
    enum: RiderPaymentMethod,
  })
  riderPaymentMethod: RiderPaymentMethod;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
