import { IsUUID, IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  invoiceId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  method: 'CASH' | 'MOBILE_MONEY' | 'INSURANCE';

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
