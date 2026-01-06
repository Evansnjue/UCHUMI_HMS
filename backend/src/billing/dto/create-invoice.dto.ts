import { IsUUID, IsArray, ValidateNested, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateBillingItemDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateInvoiceDto {
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillingItemDto)
  items: CreateBillingItemDto[];

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsNumber()
  @IsOptional()
  insuranceCoveredAmount?: number;
}
