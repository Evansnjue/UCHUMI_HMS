import { IsNumber, IsString } from 'class-validator';

export class AdjustStockDto {
  @IsNumber()
  delta: number;

  @IsString()
  reason: string;
}
