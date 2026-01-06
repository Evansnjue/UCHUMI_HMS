import { IsUUID, IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class TransferStockDto {
  @IsUUID()
  itemId: string;

  @IsUUID()
  toDepartmentId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
