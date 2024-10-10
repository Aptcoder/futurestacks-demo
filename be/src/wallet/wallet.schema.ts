import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Wallet {
  @Prop()
  bookBalance: string;

  @Prop()
  balance: number;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: User;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
