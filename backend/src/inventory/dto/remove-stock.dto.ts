import { IsUUID, IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class RemoveStockDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
