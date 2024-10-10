import { IsNumber, IsString } from 'class-validator';

export class AddSubaccountDto {
  @IsString()
  bankCode: string;

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;
}

export class FundAccountDto {
  @IsNumber()
  amount: number;
}
