import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionCategory {
  USER_DELIVERY_PAYMENT = 'user_delivery_payment',
  RIDER_DELIVERY_PAYMENT = 'rider_delivery_payment',
  FUND_WALLET = 'fund_wallet',
  WITHDRAWAL = 'withdrawal',
}

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Transaction {
  @Prop()
  balanceBefore: number;

  @Prop()
  balanceAfter: number;

  @Prop()
  amount: number;

  @Prop()
  reference: string;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: User;

  @Prop({
    enum: TransactionStatus,
    required: true,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({
    enum: TransactionType,
    required: true,
  })
  type: TransactionType;

  @Prop({
    enum: TransactionCategory,
    required: true,
  })
  category: TransactionCategory;

  @Prop({
    required: false,
  })
  metaData: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ user: 1, reference: 1 }, { unique: true });
