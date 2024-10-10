import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  RIDER = 'rider',
}

@Schema()
class WithdrawalAccount {
  @Prop()
  bankCode: string;

  @Prop()
  accountName: string;

  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;
}

@Schema({
  autoIndex: true,
})
export class User {
  @Prop({
    select: false,
  })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    default: UserRole.USER,
    type: String,
    enum: UserRole,
  })
  role: UserRole;

  @Prop({
    default: 0,
  })
  balance: number;

  @Prop({
    required: false,
  })
  subaccountCode: string;

  @Prop({
    required: false,
  })
  recipientCode: string;

  @Prop({
    required: false,
    type: WithdrawalAccount,
  })
  withdrawalAccount: WithdrawalAccount;
}

export const UserSchema = SchemaFactory.createForClass(User);
