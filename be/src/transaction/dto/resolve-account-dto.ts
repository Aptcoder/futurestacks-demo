import { IsString } from 'class-validator';

export class ResolveAccountDTO {
  @IsString()
  bankCode: string;

  @IsString()
  accountNumber: string;
}
