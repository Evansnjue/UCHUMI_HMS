import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddStockDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
