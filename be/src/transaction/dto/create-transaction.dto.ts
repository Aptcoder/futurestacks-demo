import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../transaction.schema';

export class CreateTransactionDto {
  @IsInt()
  balanceBefore: number;

  @IsInt()
  balanceAfter: number;

  @IsInt()
  amount: number;

  @IsString()
  reference: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsOptional()
  metaData?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
